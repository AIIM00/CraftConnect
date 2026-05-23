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
      console.error(error);
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
        {
          withCredentials: true,
        },
      );

      toast.success(data.message || "Warning sent successfully");
      closeWarningModal();
      fetchReviews();
    } catch (error) {
      console.error(error);
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
    return <p className="text-text-muted">Loading reviews...</p>;
  }

  return (
    <div>
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-semibold text-primary-light mb-2">
            Review Moderation
          </p>

          <h1 className="text-3xl font-extrabold text-primary">
            Customer Reviews
          </h1>

          <p className="text-text-muted mt-2 max-w-3xl">
            Review customer feedback, inspect craftsman performance, and send
            improvement warnings when a service needs attention.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReviews}
          className="w-fit inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary-light transition"
        >
          <RefreshIcon fontSize="small" />
          Refresh
        </button>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <SummaryCard
          title="Total Reviews"
          value={reviews.length}
          note="All customer reviews"
          icon={<StarIcon />}
          color="bg-yellow-50 text-yellow-700"
        />

        <SummaryCard
          title="Low Reviews"
          value={lowReviews.length}
          note="Reviews below 3.0"
          icon={<ReportProblemIcon />}
          color="bg-red-50 text-red-600"
        />

        <SummaryCard
          title="Warned Tasks"
          value={warnedReviews.length}
          note="Reviews with task warnings"
          icon={<WarningAmberIcon />}
          color="bg-orange-50 text-orange-600"
        />

        <SummaryCard
          title="Average Score"
          value={averageScore}
          note="Overall detailed average"
          icon={<StarIcon />}
          color="bg-blue-50 text-blue-600"
        />
      </section>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm py-16 text-center">
          <p className="text-xl font-extrabold text-text">No reviews found.</p>
          <p className="text-text-muted mt-2">
            Customer reviews will appear here after completed tasks.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
  );
}

function ReviewCard({ review, onWarn }) {
  const score = getReviewScore(review);
  const tags = normalizeTags(review.issueTags);
  const warnings = review.task?.warnings || [];
  const warningCount = warnings.length;

  return (
    <article className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-extrabold ${getScoreClass(
                score,
              )}`}
            >
              <StarIcon sx={{ fontSize: 17 }} />
              {score.toFixed(1)}/5
            </span>

            {warningCount > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold bg-orange-100 text-orange-700">
                <WarningAmberIcon sx={{ fontSize: 17 }} />
                {warningCount} warning{warningCount === 1 ? "" : "s"}
              </span>
            )}

            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                review.wouldRecommend
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <ThumbUpAltIcon sx={{ fontSize: 17 }} />
              {review.wouldRecommend ? "Recommended" : "Not recommended"}
            </span>

            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                review.wouldHireAgain
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <ReplayIcon sx={{ fontSize: 17 }} />
              {review.wouldHireAgain ? "Would hire again" : "Would not rehire"}
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-text mt-4">
            {review.task?.title || "Unknown Task"}
          </h2>

          <p className="text-sm text-text-muted mt-1">
            {formatDate(review.createdAt)}
          </p>
        </div>

        <button
          type="button"
          onClick={onWarn}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-50 text-red-600 font-extrabold hover:bg-red-100 transition"
        >
          <WarningAmberIcon fontSize="small" />
          Warn Craftsman
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
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
        <div className="flex flex-wrap gap-2 mt-5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-bold px-3 py-1 rounded-full bg-bg border border-gray-100 text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="rounded-2xl bg-bg p-4 border border-gray-100 mt-5">
        <p className="text-sm font-bold text-text mb-2">Customer Comment</p>

        <p className="text-text-muted leading-relaxed">
          {review.comment || "No comment provided."}
        </p>
      </div>

      {warningCount > 0 && (
        <div className="mt-5 rounded-2xl bg-orange-50 border border-orange-100 p-4">
          <p className="font-extrabold text-orange-700 mb-3">
            Previous warnings for this craftsman
          </p>

          <div className="space-y-3">
            {warnings.map((warning) => (
              <div
                key={warning.id}
                className="rounded-2xl bg-white border border-orange-100 p-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <p className="text-sm font-bold text-text">
                    By {warning.admin?.name || "Admin"}
                  </p>

                  <p className="text-xs text-text-muted">
                    {formatDate(warning.createdAt)}
                  </p>
                </div>

                <p className="text-sm text-orange-700 mt-2">
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100">
          <div>
            <p className="text-sm font-bold text-red-600 mb-1">
              Craftsman Warning
            </p>

            <h2 className="text-2xl font-extrabold text-primary">
              Send Improvement Warning
            </h2>

            <p className="text-text-muted mt-2">
              This warning will be connected to the reviewed task.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-bg hover:bg-gray-100 flex items-center justify-center transition"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="rounded-2xl bg-bg border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-extrabold text-text">
                  {review.craftsman?.user?.name || "Unknown craftsman"}
                </p>

                <p className="text-sm text-text-muted">
                  {review.craftsman?.user?.email || "No email"}
                </p>

                <p className="text-sm text-text-muted mt-1">
                  Task: {review.task?.title || "Unknown task"}
                </p>
              </div>

              <span
                className={`w-fit inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-extrabold ${getScoreClass(
                  score,
                )}`}
              >
                <StarIcon sx={{ fontSize: 17 }} />
                {score.toFixed(1)}/5
              </span>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-gray-100 text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-extrabold text-text mb-2">
              Warning Message
            </label>

            <textarea
              value={warningReason}
              onChange={(event) => setWarningReason(event.target.value)}
              rows={6}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 font-semibold text-text outline-none focus:border-primary resize-none"
              placeholder="Explain what the craftsman should improve..."
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 p-6 border-t border-gray-100 bg-bg">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-white border border-gray-200 text-text font-extrabold hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={creatingWarning}
            className="px-5 py-3 rounded-2xl bg-red-600 text-white font-extrabold hover:bg-red-700 disabled:opacity-60 transition"
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
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold text-text-muted">{title}</p>
        <p className="text-3xl font-extrabold text-text mt-1">{value}</p>
        <p className="text-xs text-text-muted mt-1">{note}</p>
      </div>
    </div>
  );
}

function PersonBox({ icon, label, name, email, phone, extra }) {
  return (
    <div className="rounded-2xl bg-bg border border-gray-100 p-4">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-primary">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold text-text-muted">{label}</p>
          <p className="font-extrabold text-text truncate">{name}</p>
          <p className="text-sm text-text-muted truncate">{email}</p>

          {phone && <p className="text-sm text-text-muted mt-1">{phone}</p>}

          {extra && <p className="text-sm text-primary mt-1">{extra}</p>}
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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {ratings.map(([label, value]) => (
        <div
          key={label}
          className="rounded-2xl bg-bg border border-gray-100 p-3"
        >
          <p className="text-xs font-bold text-text-muted">{label}</p>

          <p className="text-lg font-extrabold text-text mt-1">
            {Number(value ?? 0).toFixed(1)}
            <span className="text-sm text-text-muted">/5</span>
          </p>
        </div>
      ))}
    </div>
  );
}

function getReviewScore(review) {
  return Number(review.detailedAverage ?? review.rating ?? 0);
}

function getScoreClass(score) {
  if (score < 2) {
    return "bg-red-100 text-red-700";
  }

  if (score < 3) {
    return "bg-orange-100 text-orange-700";
  }

  if (score < 4) {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-green-100 text-green-700";
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
