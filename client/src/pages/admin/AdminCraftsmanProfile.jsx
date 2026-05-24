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

export default function AdminCraftsmanProfile() {
  const { craftsmanId } = useParams();
  const navigate = useNavigate();

  const { backendUrl } = React.useContext(AppContext);

  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [craftsman, setCraftsman] = React.useState(null);
  const [reviews, setReviews] = React.useState([]);

  const statusStyles = {
    APPROVED: "bg-success/10 text-success",
    PENDING: "bg-warning/10 text-warning",
    REJECTED: "bg-danger/10 text-danger",
    SUSPENDED: "bg-danger/10 text-danger",
  };

  const warningStyles = {
    NONE: "bg-success/10 text-success",
    LOW: "bg-warning/10 text-warning",
    MEDIUM: "bg-secondary/10 text-secondary",
    HIGH: "bg-danger/10 text-danger",
  };

  const fetchCraftsmanProfile = async () => {
    try {
      setLoading(true);

      const [craftsmenRes, reviewsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/craftsmen`, {
          withCredentials: true,
        }),
        axios.get(`${backendUrl}/api/admin/reviews`, {
          withCredentials: true,
        }),
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
        { withCredentials: true },
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
        {},
        { withCredentials: true },
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
    return (
      <section className="min-h-screen bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-md rounded-3xl border border-border-soft bg-card-gradient p-8 text-center shadow-card">
          <EngineeringIcon className="text-primary" />
          <p className="mt-4 font-bold text-primary">
            Loading craftsman profile...
          </p>
        </div>
      </section>
    );
  }

  if (!craftsman) return null;

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
    <section className="relative min-h-screen overflow-hidden bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-container">
        {/* HERO */}
        <div className="mb-8 rounded-3xl border border-border-soft bg-primary-gradient p-6 text-white shadow-card sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                to="/admin/craftsmen"
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary backdrop-blur-sm transition hover:bg-white/15"
              >
                <ArrowBackIcon fontSize="small" />
                Back to craftsmen
              </Link>

              <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
                {craftsman.name}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">
                Review craftsman status, warning level, customer feedback, and
                moderation actions.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchCraftsmanProfile}
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-secondary-gradient px-5 py-3 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <RefreshIcon fontSize="small" />
              Refresh
            </button>
          </div>
        </div>

        {/* STATS */}
        <section className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <StatCard
            icon={<EngineeringIcon />}
            label="Status"
            value={status}
            note="Current account status"
            color="bg-primary/10 text-primary"
          />

          <StatCard
            icon={<WarningAmberIcon />}
            label="Warning Level"
            value={warningLevel}
            note="Based on admin warnings"
            color="bg-danger/10 text-danger"
          />

          <StatCard
            icon={<StarIcon />}
            label="Average Review"
            value={averageRating}
            note={`${reviews.length} review(s) found`}
            color="bg-warning/10 text-warning"
          />

          <StatCard
            icon={<AssignmentIcon />}
            label="Low Reviews"
            value={lowReviews.length}
            note="Reviews below 3.0"
            color="bg-secondary/10 text-secondary"
          />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-6 xl:col-span-2">
            <Panel title="Profile Details">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                <InfoBlock label="Name">{craftsman.name}</InfoBlock>

                <InfoBlock label="Role">{craftsman.role}</InfoBlock>

                <InfoBlock label="Email">
                  <span className="inline-flex items-center gap-2 flex-wrap">
                    <EmailIcon fontSize="small" className="text-secondary" />
                    {craftsman.email}
                  </span>
                </InfoBlock>

                <InfoBlock label="Phone">
                  <span className="inline-flex items-center gap-2">
                    <PhoneIcon fontSize="small" className="text-secondary" />
                    {craftsman.phoneNumber || "No phone number"}
                  </span>
                </InfoBlock>

                <InfoBlock label="Verification">
                  {craftsman.isAccountVerified ? (
                    <span className="inline-flex items-center gap-2 font-bold text-success">
                      <VerifiedIcon fontSize="small" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 font-bold text-warning">
                      <ErrorOutlineOutlinedIcon fontSize="small" />
                      Not verified
                    </span>
                  )}
                </InfoBlock>

                <InfoBlock label="Warning Level">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      warningStyles[warningLevel]
                    }`}
                  >
                    {warningLevel}
                  </span>
                </InfoBlock>

                <InfoBlock label="Status">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      statusStyles[status]
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

          {/* RIGHT */}
          <aside className="space-y-6">
            <Panel title="Admin Actions">
              <div className="space-y-3">
                {status !== "SUSPENDED" ? (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={suspendCraftsman}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-danger px-4 py-3 text-xs font-bold text-white transition hover:brightness-95 disabled:opacity-60"
                  >
                    <BlockIcon fontSize="small" />

                    {actionLoading ? "Suspending..." : "Suspend Craftsman"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={restoreCraftsman}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-success px-4 py-3 text-xs font-bold text-white transition hover:brightness-95 disabled:opacity-60"
                  >
                    <RestartAltIcon fontSize="small" />

                    {actionLoading ? "Restoring..." : "Restore Craftsman"}
                  </button>
                )}

                <a
                  href={`mailto:${craftsman.email}`}
                  className="block rounded-2xl border border-border-soft bg-background px-4 py-3 text-center text-xs font-bold text-primary transition hover:bg-background-light"
                >
                  Email Craftsman
                </a>

                {craftsman.phoneNumber && (
                  <a
                    href={`tel:${craftsman.phoneNumber}`}
                    className="block rounded-2xl border border-border-soft bg-background px-4 py-3 text-center text-sm font-bold text-primary transition hover:bg-background-light"
                  >
                    Call Craftsman
                  </a>
                )}
              </div>
            </Panel>

            <Panel title="Admin Notes">
              <div className="rounded-2xl border border-warning/20 bg-warning/10 p-5">
                <p className="font-bold text-warning">
                  Recommended next feature
                </p>

                <p className="mt-3 text-[10px] leading-7 text-text-muted">
                  Add an internal notes system so admins can record calls,
                  complaints, and follow-up actions for this craftsman.
                </p>
              </div>
            </Panel>
          </aside>
        </section>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value, note, color }) {
  return (
    <div className="rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${color}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[12px] font-bold text-text-muted">{label}</p>

          <p className="mt-1 truncate text-[14px] font-bold text-primary">
            {value}
          </p>

          <p className="mt-1 text-[10px] text-text-muted">{note}</p>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="rounded-3xl border border-border-soft bg-card-gradient p-6 shadow-card">
      <h2 className="mb-5 font-heading text-xl font-bold text-primary">
        {title}
      </h2>

      {children}
    </div>
  );
}

function InfoBlock({ label, children }) {
  return (
    <div className="rounded-3xl border border-border-soft bg-background p-4 shadow-soft">
      <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.08em] text-text-muted">
        {label}
      </p>

      <div className="text-[10px] font-bold text-text">{children}</div>
    </div>
  );
}

function ReviewCard({ review }) {
  const score = Number(review.detailedAverage ?? review.rating ?? 0).toFixed(1);

  return (
    <div className="rounded-3xl border border-border-soft bg-background p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-text">
            {review.task?.title || "Unknown task"}
          </p>

          <p className="mt-1 text-sm text-text-muted">
            Customer: {review.user?.name || "Unknown customer"}
          </p>
        </div>

        <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-bold text-warning">
          {score}/5
        </span>
      </div>

      {review.issueTags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {review.issueTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border-soft bg-card-gradient px-3 py-1 text-xs font-semibold text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="mt-4 text-sm leading-7 text-text-muted">
        {review.comment || "No comment provided."}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
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
    <div className="rounded-2xl border border-border-soft bg-card-gradient p-3 text-center shadow-soft">
      <p className="text-lg font-bold text-primary">{value ?? "N/A"}</p>

      <p className="mt-1 text-xs font-semibold text-text-muted">{label}</p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-border-soft bg-background p-10 text-xs text-center">
      <p className="font-bold text-text">{message}</p>
    </div>
  );
}
