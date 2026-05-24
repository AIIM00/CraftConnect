// src/pages/craftsman/Reviews.jsx
import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../../context/AppContext";
import Btn from "../../components/Btn";

// MUI Icons
import StarIcon from "@mui/icons-material/Star";
import ReviewsIcon from "@mui/icons-material/Reviews";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ReplayIcon from "@mui/icons-material/Replay";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function Reviews() {
  const { backendUrl } = React.useContext(AppContext);

  const [reviews, setReviews] = React.useState([]);
  const [stats, setStats] = React.useState({
    totalReviews: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = React.useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${backendUrl}/api/craftsman/reviews`, {
        withCredentials: true,
      });

      if (data.success) {
        setReviews(data.reviews || []);
        setStats(
          data.stats || {
            totalReviews: data.reviews?.length || 0,
            averageRating: 0,
          },
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReviews();
  }, [backendUrl]);

  if (loading) {
    return (
      <section className="min-h-screen bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center">
          <div className="w-full rounded-3xl border border-border-soft bg-card-gradient p-8 text-center shadow-card">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
              <ReviewsIcon />
            </div>

            <h1 className="font-heading text-2xl font-bold text-primary">
              Loading Reviews
            </h1>

            <p className="mt-2 text-sm text-text-muted">
              Please wait while customer feedback is loading.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-container">
        <div className="mb-8 overflow-hidden rounded-3xl border border-border-soft bg-primary-gradient p-6 text-white shadow-card sm:p-8">
          <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
            Craftsman Workspace
          </p>

          <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
            Customer Reviews
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            Track customer satisfaction and view feedback from completed
            services.
          </p>
        </div>

        <section className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            icon={<ReviewsIcon />}
            label="Total Reviews"
            value={stats.totalReviews}
            note="Customer reviews received"
            color="bg-primary/10 text-primary"
          />

          <SummaryCard
            icon={<StarIcon />}
            label="Average Rating"
            value={`${stats.averageRating || 0}/5`}
            note="Overall customer rating"
            color="bg-secondary/10 text-secondary"
          />

          <SummaryCard
            icon={<ThumbUpAltIcon />}
            label="Recommendation"
            value={`${getRecommendationPercentage(reviews)}%`}
            note="Customers would recommend you"
            color="bg-success/10 text-success"
          />
        </section>

        <section className="rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-card sm:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Customer Reviews
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                Reviews are based on tasks completed by you.
              </p>
            </div>

            <Btn
              type="button"
              onClick={fetchReviews}
              variant="outline"
              className="rounded-xl"
            >
              <RefreshIcon fontSize="small" />
              Refresh
            </Btn>
          </div>

          {reviews.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border-soft bg-background p-10 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
                <ReviewsIcon fontSize="large" />
              </div>

              <h3 className="font-heading text-2xl font-bold text-primary">
                No reviews yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-text-muted">
                Customer reviews will appear here after completed tasks are
                reviewed.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

function ReviewCard({ review }) {
  return (
    <article className="rounded-3xl border border-border-soft bg-background p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
              <ReviewsIcon />
            </div>

            <div>
              <h3 className="font-bold text-text">
                {review.user?.name || "Customer"}
              </h3>

              <p className="text-sm text-text-muted">
                {formatDate(review.createdAt)}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-text-muted">
            <span className="flex items-center gap-1">
              <AssignmentIcon fontSize="small" />
              {review.task?.title || "Task"}
            </span>

            {review.task?.location && (
              <span className="flex items-center gap-1">
                <LocationOnIcon fontSize="small" />
                {review.task.location}
              </span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border-soft bg-card-gradient px-4 py-3 text-right shadow-soft">
          <div className="flex items-center justify-end gap-1 text-secondary">
            {renderStars(review.rating)}
          </div>

          <p className="mt-1 text-sm font-bold text-text">
            {review.rating || 0}/5
          </p>
        </div>
      </div>

      {review.comment && (
        <p className="mb-5 rounded-2xl border border-border-soft bg-card-gradient p-4 text-sm leading-6 text-text-muted shadow-soft">
          “{review.comment}”
        </p>
      )}

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <RatingRow label="Quality" value={review.qualityRating} />
        <RatingRow label="Punctuality" value={review.punctualityRating} />
        <RatingRow label="Communication" value={review.communicationRating} />
        <RatingRow
          label="Professionalism"
          value={review.professionalismRating}
        />
        <RatingRow label="Cleanliness" value={review.cleanlinessRating} />
        <RatingRow label="Price Fairness" value={review.priceFairnessRating} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Badge
          active={review.wouldRecommend}
          icon={<ThumbUpAltIcon fontSize="small" />}
          text={
            review.wouldRecommend ? "Would recommend" : "Would not recommend"
          }
        />

        <Badge
          active={review.wouldHireAgain}
          icon={<ReplayIcon fontSize="small" />}
          text={
            review.wouldHireAgain ? "Would hire again" : "Would not hire again"
          }
        />

        {review.task?.service?.name && (
          <span className="rounded-full border border-border-soft bg-card-gradient px-4 py-2 text-xs font-bold text-text-muted">
            {review.task.service.name}
          </span>
        )}
      </div>

      {review.issueTags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {review.issueTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-danger/10 px-3 py-1 text-xs font-bold text-danger"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

function SummaryCard({ icon, label, value, note, color }) {
  return (
    <div className="rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${color}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm font-bold text-text-muted">{label}</p>

          <p className="mt-1 text-3xl font-bold text-primary">{value}</p>

          <p className="mt-1 text-xs text-text-muted">{note}</p>
        </div>
      </div>
    </div>
  );
}

function RatingRow({ label, value }) {
  const safeValue = value || 0;

  return (
    <div className="rounded-2xl border border-border-soft bg-card-gradient px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-text">{label}</p>

        <p className="text-sm font-bold text-primary">{safeValue}/5</p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-background-light">
        <div
          className="h-full rounded-full bg-secondary-gradient"
          style={{ width: `${(safeValue / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}

function Badge({ active, icon, text }) {
  return (
    <span
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
        active ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
      }`}
    >
      {icon}
      {text}
    </span>
  );
}

function renderStars(rating) {
  const safeRating = Math.max(0, Math.min(5, rating || 0));

  return (
    <>
      {"★".repeat(safeRating)}
      <span className="text-text-muted">{"★".repeat(5 - safeRating)}</span>
    </>
  );
}

function formatDate(date) {
  if (!date) return "Unknown date";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getRecommendationPercentage(reviews) {
  if (!reviews.length) return 0;

  const recommendedCount = reviews.filter(
    (review) => review.wouldRecommend,
  ).length;

  return Math.round((recommendedCount / reviews.length) * 100);
}
