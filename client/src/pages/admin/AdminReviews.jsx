// src/pages/admin/AdminReviews.jsx

import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import EngineeringIcon from "@mui/icons-material/Engineering";
import CloseIcon from "@mui/icons-material/Close";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ReplayIcon from "@mui/icons-material/Replay";

export default function AdminReviews() {
  const { backendUrl } = React.useContext(AppContext);

  const [reviews, setReviews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [creatingWarning, setCreatingWarning] = React.useState(false);
  const [selectedReview, setSelectedReview] = React.useState(null);
  const [warningReason, setWarningReason] = React.useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${backendUrl}/api/admin/reviews`, {
        withCredentials: true,
      });

      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReviews();
  }, [backendUrl]);

  const openWarningModal = (review) => {
    const tags = normalizeTags(review.issueTags);

    setSelectedReview(review);
    setWarningReason(
      tags.length > 0
        ? `Customer reported issues in: ${tags.join(", ")}. Please improve these areas in future tasks.`
        : "Customer review indicates that service quality needs improvement. Please improve your work quality, communication, and customer experience.",
    );
  };

  const closeWarningModal = () => {
    setSelectedReview(null);
    setWarningReason("");
  };

  const handleCreateWarning = async () => {
    if (!selectedReview?.craftsman?.userId) {
      toast.error("Craftsman not found for this review");
      return;
    }

    if (!selectedReview?.task?.id) {
      toast.error("Task not found for this review");
      return;
    }

    if (!warningReason.trim()) {
      toast.error("Warning message is required");
      return;
    }

    try {
      setCreatingWarning(true);

      const craftsmanId = selectedReview.craftsman.userId;

      const { data } = await axios.post(
        `${backendUrl}/api/admin/warnings/${craftsmanId}`,
        {
          message: warningReason,
          taskId: selectedReview.task.id,
        },
        { withCredentials: true },
      );

      toast.success(data.message || "Warning sent successfully");
      closeWarningModal();
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send warning");
    } finally {
      setCreatingWarning(false);
    }
  };

  const lowReviews = reviews.filter((review) => getReviewScore(review) < 3);
  const warnedReviews = reviews.filter(
    (review) => review.task?.warnings?.length > 0,
  );

  const averageScore =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + getReviewScore(review), 0) /
          reviews.length
        ).toFixed(1)
      : "N/A";

  if (loading) {
    return (
      <section className="min-h-screen bg-background-dark bg-hero-gradient px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-md rounded-3xl border border-border-soft bg-card-gradient p-8 text-center shadow-card">
          <StarIcon className="text-primary" />
          <p className="mt-4 text-sm font-bold text-primary">
            Loading reviews...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-background-dark bg-hero-gradient px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-container">
        <div className="mb-6 rounded-3xl border border-border-soft bg-primary-gradient p-5 text-white shadow-card sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary backdrop-blur-sm sm:text-xs">
                Review Moderation
              </p>

              <h1 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
                Customer Reviews
              </h1>

              <p className="mt-3 max-w-3xl text-xs leading-6 text-white/80 sm:text-sm">
                Review feedback, inspect craftsman performance, and send
                warnings when service quality needs attention.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchReviews}
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-secondary-gradient px-4 py-3 text-xs font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated sm:text-sm"
            >
              <RefreshIcon fontSize="small" />
              Refresh
            </button>
          </div>
        </div>

        <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryCard
            title="Total Reviews"
            value={reviews.length}
            note="All customer reviews"
            icon={<StarIcon />}
            color="bg-warning/10 text-warning"
          />

          <SummaryCard
            title="Low Reviews"
            value={lowReviews.length}
            note="Reviews below 3.0"
            icon={<ReportProblemIcon />}
            color="bg-danger/10 text-danger"
          />

          <SummaryCard
            title="Warned Tasks"
            value={warnedReviews.length}
            note="Reviews with warnings"
            icon={<WarningAmberIcon />}
            color="bg-secondary/10 text-secondary"
          />

          <SummaryCard
            title="Average Score"
            value={averageScore}
            note="Overall average"
            icon={<StarIcon />}
            color="bg-primary/10 text-primary"
          />
        </section>

        {reviews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border-soft bg-card-gradient p-10 text-center shadow-soft">
            <p className="text-sm font-bold text-text">No reviews found.</p>
            <p className="mt-2 text-xs text-text-muted sm:text-sm">
              Customer reviews will appear here after completed tasks.
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onWarn={() => openWarningModal(review)}
              />
            ))}
          </section>
        )}

        {selectedReview && (
          <WarningModal
            review={selectedReview}
            warningReason={warningReason}
            setWarningReason={setWarningReason}
            creatingWarning={creatingWarning}
            onClose={closeWarningModal}
            onSubmit={handleCreateWarning}
          />
        )}
      </div>
    </section>
  );
}

function ReviewCard({ review, onWarn }) {
  const score = getReviewScore(review);
  const tags = normalizeTags(review.issueTags);
  const warnings = review.task?.warnings || [];
  const warningCount = warnings.length;

  return (
    <article className="rounded-3xl border border-border-soft bg-card-gradient p-4 shadow-card sm:p-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill className={getScoreClass(score)}>
              <StarIcon sx={{ fontSize: 15 }} />
              {score.toFixed(1)}/5
            </StatusPill>

            {warningCount > 0 && (
              <StatusPill className="bg-secondary/10 text-secondary">
                <WarningAmberIcon sx={{ fontSize: 15 }} />
                {warningCount} warning{warningCount === 1 ? "" : "s"}
              </StatusPill>
            )}

            <StatusPill
              className={
                review.wouldRecommend
                  ? "bg-success/10 text-success"
                  : "bg-danger/10 text-danger"
              }
            >
              <ThumbUpAltIcon sx={{ fontSize: 15 }} />
              {review.wouldRecommend ? "Recommended" : "Not recommended"}
            </StatusPill>

            <StatusPill
              className={
                review.wouldHireAgain
                  ? "bg-success/10 text-success"
                  : "bg-danger/10 text-danger"
              }
            >
              <ReplayIcon sx={{ fontSize: 15 }} />
              {review.wouldHireAgain ? "Hire again" : "No rehire"}
            </StatusPill>
          </div>

          <h2 className="mt-4 font-heading text-base font-bold text-primary">
            {review.task?.title || "Unknown Task"}
          </h2>

          <p className="mt-1 text-xs text-text-muted">
            {formatDate(review.createdAt)}
          </p>
        </div>

        <button
          type="button"
          onClick={onWarn}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-xs font-bold text-danger transition hover:bg-danger hover:text-white sm:text-sm"
        >
          <WarningAmberIcon fontSize="small" />
          Warn Craftsman
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        <PersonBox
          icon={<PersonIcon />}
          label="Customer"
          name={review.user?.name || "Unknown customer"}
          email={review.user?.email || "No email"}
          phone={review.user?.phoneNumber}
        />

        <PersonBox
          icon={<EngineeringIcon />}
          label="Craftsman"
          name={review.craftsman?.user?.name || "Unknown craftsman"}
          email={review.craftsman?.user?.email || "No email"}
          phone={review.craftsman?.user?.phoneNumber}
          extra={
            review.craftsman?.category?.name
              ? `Category: ${review.craftsman.category.name}`
              : null
          }
        />
      </div>

      <RatingGrid review={review} />

      {tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border-soft bg-background px-3 py-1 text-[10px] font-bold text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-border-soft bg-background p-4">
        <p className="mb-2 text-xs font-bold text-text">Customer Comment</p>

        <p className="text-xs leading-6 text-text-muted sm:text-sm">
          {review.comment || "No comment provided."}
        </p>
      </div>

      {warningCount > 0 && (
        <div className="mt-5 rounded-2xl border border-secondary/20 bg-secondary/10 p-4">
          <p className="mb-3 text-sm font-bold text-secondary">
            Previous warnings
          </p>

          <div className="space-y-3">
            {warnings.map((warning) => (
              <div
                key={warning.id}
                className="rounded-2xl border border-border-soft bg-card-gradient p-3"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-bold text-text">
                    By {warning.admin?.name || "Admin"}
                  </p>

                  <p className="text-[10px] text-text-muted">
                    {formatDate(warning.createdAt)}
                  </p>
                </div>

                <p className="mt-2 text-xs leading-5 text-secondary">
                  {warning.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function WarningModal({
  review,
  warningReason,
  setWarningReason,
  creatingWarning,
  onClose,
  onSubmit,
}) {
  const score = getReviewScore(review);
  const tags = normalizeTags(review.issueTags);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-border-soft bg-card-gradient shadow-glass">
        <div className="flex items-start justify-between gap-4 border-b border-border-soft bg-primary-gradient p-5 text-white sm:p-6">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary sm:text-xs">
              Craftsman Warning
            </p>

            <h2 className="font-heading text-xl font-bold sm:text-2xl">
              Send Improvement Warning
            </h2>

            <p className="mt-2 text-xs leading-6 text-white/75 sm:text-sm">
              This warning will be connected to the reviewed task.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition hover:bg-danger"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="rounded-2xl border border-border-soft bg-background p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-text">
                  {review.craftsman?.user?.name || "Unknown craftsman"}
                </p>

                <p className="text-xs text-text-muted">
                  {review.craftsman?.user?.email || "No email"}
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  Task: {review.task?.title || "Unknown task"}
                </p>
              </div>

              <StatusPill className={getScoreClass(score)}>
                <StarIcon sx={{ fontSize: 15 }} />
                {score.toFixed(1)}/5
              </StatusPill>
            </div>

            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border-soft bg-card-gradient px-3 py-1 text-[10px] font-bold text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-primary">
              Warning Message
            </label>

            <textarea
              value={warningReason}
              onChange={(event) => setWarningReason(event.target.value)}
              rows={6}
              className="w-full resize-none rounded-2xl border border-border-soft bg-background px-4 py-3 text-sm font-semibold text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              placeholder="Explain what the craftsman should improve..."
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border-soft bg-background p-5 sm:flex-row sm:justify-end sm:p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-border-soft bg-card-gradient px-5 py-3 text-xs font-bold text-text transition hover:bg-background-light sm:text-sm"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={creatingWarning}
            className="rounded-2xl bg-danger px-5 py-3 text-xs font-bold text-white transition hover:brightness-95 disabled:opacity-60 sm:text-sm"
          >
            {creatingWarning ? "Sending..." : "Send Warning"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, note, icon, color }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-card-gradient p-3 shadow-soft transition hover:-translate-y-1 hover:shadow-card sm:p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color} sm:h-12 sm:w-12`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.08em] text-text-muted sm:text-[11px]">
            {title}
          </p>

          <p className="mt-0.5 truncate text-lg font-extrabold text-primary sm:text-xl">
            {value}
          </p>

          <p className="hidden text-[10px] text-text-muted sm:block">{note}</p>
        </div>
      </div>
    </div>
  );
}

function PersonBox({ icon, label, name, email, phone, extra }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-background p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-soft">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-text-muted">
            {label}
          </p>

          <p className="truncate text-sm font-bold text-text">{name}</p>
          <p className="truncate text-xs text-text-muted">{email}</p>

          {phone && <p className="mt-1 text-xs text-text-muted">{phone}</p>}

          {extra && (
            <p className="mt-1 text-xs font-semibold text-primary">{extra}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function RatingGrid({ review }) {
  const ratings = [
    ["Quality", review.qualityRating],
    ["Punctuality", review.punctualityRating],
    ["Communication", review.communicationRating],
    ["Professionalism", review.professionalismRating],
    ["Cleanliness", review.cleanlinessRating],
    ["Price Fairness", review.priceFairnessRating],
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {ratings.map(([label, value]) => (
        <div
          key={label}
          className="rounded-2xl border border-border-soft bg-background p-3"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-text-muted">
            {label}
          </p>

          <p className="mt-1 text-sm font-bold text-primary">
            {Number(value ?? 0).toFixed(1)}
            <span className="text-[10px] text-text-muted"> /5</span>
          </p>
        </div>
      ))}
    </div>
  );
}

function StatusPill({ children, className }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold sm:text-xs ${className}`}
    >
      {children}
    </span>
  );
}

function getReviewScore(review) {
  return Number(review.detailedAverage ?? review.rating ?? 0);
}

function getScoreClass(score) {
  if (score < 2) return "bg-danger/10 text-danger";
  if (score < 3) return "bg-secondary/10 text-secondary";
  if (score < 4) return "bg-warning/10 text-warning";
  return "bg-success/10 text-success";
}

function normalizeTags(tags) {
  if (!tags) return [];

  if (Array.isArray(tags)) return tags;

  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed : [tags];
    } catch {
      return [tags];
    }
  }

  return [];
}

function formatDate(date) {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
