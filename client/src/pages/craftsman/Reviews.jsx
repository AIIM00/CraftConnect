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
    return <p className="text-text-muted">Loading reviews...</p>;
  }

  return (
    <section className="min-h-screen bg-bg text-text">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-text">Reviews</h2>
        <p className="mt-2 text-text-muted">
          See customer feedback from your completed tasks.
        </p>
      </div>

      {/* Summary */}
      <section className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          icon={<ReviewsIcon />}
          label="Total Reviews"
          value={stats.totalReviews}
          note="Customer reviews received"
          color="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          icon={<StarIcon />}
          label="Average Rating"
          value={`${stats.averageRating || 0}/5`}
          note="Overall customer rating"
          color="bg-yellow-50 text-yellow-600"
        />

        <SummaryCard
          icon={<ThumbUpAltIcon />}
          label="Recommendation"
          value={`${getRecommendationPercentage(reviews)}%`}
          note="Customers would recommend you"
          color="bg-green-50 text-green-600"
        />
      </section>

      {/* Reviews List */}
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-text">
              Customer Reviews
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              Reviews are based on tasks completed by you.
            </p>
          </div>

          <Btn
            type="button"
            onClick={fetchReviews}
            variant="outline"
            className="rounded-2xl px-5 py-3 font-bold"
          >
            Refresh
          </Btn>
        </div>

        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-bg p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-primary">
              <ReviewsIcon fontSize="large" />
            </div>

            <h4 className="text-lg font-extrabold text-text">No reviews yet</h4>

            <p className="mt-2 text-sm text-text-muted">
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
    </section>
  );
}

function ReviewCard({ review }) {
  return (
    <article className="rounded-3xl border border-gray-100 bg-bg p-5">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary">
              <ReviewsIcon />
            </div>

            <div>
              <h4 className="font-extrabold text-text">
                {review.user?.name || "Customer"}
              </h4>

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

        <div className="rounded-2xl bg-white px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1 text-yellow-500">
            {renderStars(review.rating)}
          </div>

          <p className="mt-1 text-sm font-bold text-text">{review.rating}/5</p>
        </div>
      </div>

      {review.comment && (
        <p className="mb-5 rounded-2xl bg-white p-4 text-sm leading-6 text-text-muted">
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
          <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-text-muted">
            {review.task.service.name}
          </span>
        )}
      </div>

      {review.issueTags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {review.issueTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600"
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
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${color}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-text-muted">{label}</p>
          <p className="mt-1 text-3xl font-extrabold text-text">{value}</p>
          <p className="mt-1 text-xs text-text-muted">{note}</p>
        </div>
      </div>
    </div>
  );
}

function RatingRow({ label, value }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3">
      <div className="mb-1 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-text">{label}</p>
        <p className="text-sm font-extrabold text-text">{value}/5</p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-yellow-400"
          style={{ width: `${((value || 0) / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}

function Badge({ active, icon, text }) {
  return (
    <span
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
        active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
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
      <span className="text-gray-300">{"★".repeat(5 - safeRating)}</span>
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
