import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EngineeringIcon from "@mui/icons-material/Engineering";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import VerifiedIcon from "@mui/icons-material/Verified";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import BlockIcon from "@mui/icons-material/Block";
import StarIcon from "@mui/icons-material/Star";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RefreshIcon from "@mui/icons-material/Refresh";

const statusStyles = {
  APPROVED: "bg-green-100 text-green-700",
  PENDING: "bg-orange-100 text-orange-700",
  REJECTED: "bg-red-100 text-red-700",
  SUSPENDED: "bg-red-100 text-red-700",
};

const warningStyles = {
  NONE: "bg-green-100 text-green-700",
  LOW: "bg-yellow-100 text-yellow-700",
  MEDIUM: "bg-orange-100 text-orange-700",
  HIGH: "bg-red-100 text-red-700",
};

export default function AdminCraftsmanProfile() {
  const { craftsmanId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = React.useContext(AppContext);

  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [craftsman, setCraftsman] = React.useState(null);
  const [reviews, setReviews] = React.useState([]);

  const fetchCraftsmanProfile = async () => {
    try {
      setLoading(true);

      const [craftsmenRes, reviewsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/craftsmen`),
        axios.get(`${backendUrl}/api/admin/reviews`),
      ]);

      const craftsmen = Array.isArray(craftsmenRes.data)
        ? craftsmenRes.data
        : [];

      const foundCraftsman = craftsmen.find(
        (item) =>
          item.id === craftsmanId || item.craftsman?.userId === craftsmanId,
      );

      if (!foundCraftsman) {
        toast.error("Craftsman not found");
        navigate("/admin/craftsmen");
        return;
      }

      const allReviews = Array.isArray(reviewsRes.data) ? reviewsRes.data : [];

      const craftsmanReviews = allReviews.filter(
        (review) =>
          review.craftsman?.userId === craftsmanId ||
          review.craftsmanId === craftsmanId,
      );

      setCraftsman(foundCraftsman);
      setReviews(craftsmanReviews);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to load craftsman profile",
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCraftsmanProfile();
  }, [backendUrl, craftsmanId]);

  const suspendCraftsman = async () => {
    try {
      setActionLoading(true);

      const { data } = await axios.patch(
        `${backendUrl}/api/admin/craftsmen/applications/${craftsmanId}/status`,
        {
          status: "SUSPENDED",
        },
      );

      toast.success(data.message || "Craftsman suspended successfully");
      await fetchCraftsmanProfile();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to suspend craftsman",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const restoreCraftsman = async () => {
    try {
      setActionLoading(true);

      const { data } = await axios.patch(
        `${backendUrl}/api/admin/craftsmen/restore/${craftsmanId}`,
      );

      toast.success(data.message || "Craftsman restored successfully");
      await fetchCraftsmanProfile();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to restore craftsman",
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <p className="text-text-muted">Loading craftsman profile...</p>;
  }

  if (!craftsman) {
    return null;
  }

  const status = craftsman.craftsman?.status || "UNKNOWN";
  const warningLevel = craftsman.craftsman?.warningLevel || "NONE";

  const averageRating =
    reviews.length === 0
      ? "N/A"
      : (
          reviews.reduce((sum, review) => {
            return sum + Number(review.detailedAverage ?? review.rating ?? 0);
          }, 0) / reviews.length
        ).toFixed(1);

  const lowReviews = reviews.filter(
    (review) => Number(review.detailedAverage ?? review.rating ?? 5) < 3,
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <Link
            to="/admin/craftsmen"
            className="inline-flex items-center gap-2 text-primary font-bold hover:underline mb-4"
          >
            <ArrowBackIcon fontSize="small" />
            Back to craftsmen
          </Link>

          <p className="text-sm font-semibold text-primary-light mb-2">
            Craftsman Profile
          </p>

          <h1 className="text-3xl font-extrabold text-primary">
            {craftsman.name}
          </h1>

          <p className="text-text-muted mt-2">
            Review craftsman status, warning level, contact information, and
            customer feedback.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCraftsmanProfile}
          className="w-fit inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary-light transition"
        >
          <RefreshIcon fontSize="small" />
          Refresh
        </button>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={<EngineeringIcon />}
          label="Status"
          value={status}
          note="Current account status"
          color="bg-blue-50 text-blue-600"
        />

        <StatCard
          icon={<WarningAmberIcon />}
          label="Warning Level"
          value={warningLevel}
          note="Based on admin warnings"
          color="bg-red-50 text-red-600"
        />

        <StatCard
          icon={<StarIcon />}
          label="Average Review"
          value={averageRating}
          note={`${reviews.length} review(s) found`}
          color="bg-yellow-50 text-yellow-700"
        />

        <StatCard
          icon={<AssignmentIcon />}
          label="Low Reviews"
          value={lowReviews.length}
          note="Reviews below 3.0"
          color="bg-orange-50 text-orange-600"
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Panel title="Profile Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoBlock label="Name">{craftsman.name}</InfoBlock>
              <InfoBlock label="Role">{craftsman.role}</InfoBlock>

              <InfoBlock label="Email">
                <span className="inline-flex items-center gap-2">
                  <EmailIcon fontSize="small" className="text-primary" />
                  {craftsman.email}
                </span>
              </InfoBlock>

              <InfoBlock label="Phone">
                <span className="inline-flex items-center gap-2">
                  <PhoneIcon fontSize="small" className="text-primary" />
                  {craftsman.phoneNumber || "No phone number"}
                </span>
              </InfoBlock>

              <InfoBlock label="Email Verification">
                {craftsman.isAccountVerified ? (
                  <span className="inline-flex items-center gap-2 text-green-700 font-bold">
                    <VerifiedIcon fontSize="small" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-orange-700 font-bold">
                    <ErrorOutlineOutlinedIcon fontSize="small" />
                    Not verified
                  </span>
                )}
              </InfoBlock>

              <InfoBlock label="Warning Level">
                <span
                  className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                    warningStyles[warningLevel] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {warningLevel}
                </span>
              </InfoBlock>

              <InfoBlock label="Status">
                <span
                  className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                    statusStyles[status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {status}
                </span>
              </InfoBlock>
            </div>
          </Panel>

          <Panel title="Customer Reviews">
            {reviews.length === 0 ? (
              <EmptyState message="No reviews found for this craftsman." />
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="Admin Actions">
            <div className="space-y-3">
              {status !== "SUSPENDED" ? (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={suspendCraftsman}
                  className="w-full py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <BlockIcon fontSize="small" />
                  {actionLoading ? "Suspending..." : "Suspend Craftsman"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={restoreCraftsman}
                  className="w-full py-3 rounded-2xl bg-green-600 text-white font-bold hover:bg-green-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <RestartAltIcon fontSize="small" />
                  {actionLoading ? "Restoring..." : "Restore Craftsman"}
                </button>
              )}

              <a
                href={`mailto:${craftsman.email}`}
                className="block text-center py-3 rounded-2xl bg-bg text-primary font-bold hover:bg-primary hover:text-white transition"
              >
                Email Craftsman
              </a>

              {craftsman.phoneNumber && (
                <a
                  href={`tel:${craftsman.phoneNumber}`}
                  className="block text-center py-3 rounded-2xl bg-bg text-primary font-bold hover:bg-primary hover:text-white transition"
                >
                  Call Craftsman
                </a>
              )}
            </div>
          </Panel>

          <Panel title="Admin Notes">
            <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-100">
              <p className="text-sm font-bold text-yellow-800">
                Recommended next feature
              </p>
              <p className="text-sm text-yellow-700 mt-2">
                Add an internal notes system so admins can record calls,
                complaints, and follow-up actions for this craftsman.
              </p>
            </div>
          </Panel>
        </aside>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, note, color }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-muted">{label}</p>
        <p className="text-2xl font-extrabold text-text mt-1 truncate">
          {value}
        </p>
        <p className="text-xs text-text-muted mt-1">{note}</p>
      </div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-extrabold text-text mb-5">{title}</h2>
      {children}
    </div>
  );
}

function InfoBlock({ label, children }) {
  return (
    <div className="p-4 rounded-2xl bg-bg">
      <p className="text-xs font-bold text-text-muted uppercase mb-2">
        {label}
      </p>
      <div className="text-sm font-semibold text-text">{children}</div>
    </div>
  );
}

function ReviewCard({ review }) {
  const score = Number(review.detailedAverage ?? review.rating ?? 0).toFixed(1);

  return (
    <div className="p-4 rounded-2xl bg-bg border border-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-text">
            {review.task?.title || "Unknown task"}
          </p>

          <p className="text-sm text-text-muted mt-1">
            Customer: {review.user?.name || "Unknown customer"}
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
          {score}/5
        </span>
      </div>

      {review.issueTags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {review.issueTags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-gray-200 text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm text-text-muted mt-3">
        {review.comment || "No comment provided."}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        <MiniReviewScore label="Quality" value={review.qualityRating} />
        <MiniReviewScore label="Punctuality" value={review.punctualityRating} />
        <MiniReviewScore
          label="Communication"
          value={review.communicationRating}
        />
        <MiniReviewScore
          label="Professionalism"
          value={review.professionalismRating}
        />
        <MiniReviewScore label="Cleanliness" value={review.cleanlinessRating} />
        <MiniReviewScore label="Price" value={review.priceFairnessRating} />
      </div>
    </div>
  );
}

function MiniReviewScore({ label, value }) {
  return (
    <div className="p-3 rounded-2xl bg-white border border-gray-100 text-center">
      <p className="text-lg font-extrabold text-primary">{value ?? "N/A"}</p>
      <p className="text-xs font-semibold text-text-muted">{label}</p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="py-12 text-center rounded-2xl bg-bg">
      <p className="font-bold text-text">{message}</p>
    </div>
  );
}
