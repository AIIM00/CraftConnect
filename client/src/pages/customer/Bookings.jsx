import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Btn from "../../components/Btn";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Bookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [cancelLoadingId, setCancelLoadingId] = React.useState(null);
  React.useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${backendUrl}/api/user/bookings`, {
        withCredentials: true,
      });

      setBookings(res.data.bookings || res.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (taskId) => {
    try {
      setCancelLoadingId(taskId);

      await axios.patch(
        `${backendUrl}/api/user/cancel/${taskId}`,
        {},
        { withCredentials: true },
      );

      await fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelLoadingId(null);
    }
  };

  const pendingBookings = bookings.filter((booking) =>
    ["PENDING", "WAITING", "UNASSIGNABLE"].includes(booking.status),
  );

  const scheduledBookings = bookings.filter(
    (booking) => booking.status === "IN_PROGRESS",
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "COMPLETED",
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-background-dark bg-hero-gradient px-4 py-24 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-container">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-secondary/20 bg-secondary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
              Customer Workspace
            </p>

            <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
              My Bookings
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
              Track your service requests, scheduled visits, and completed
              tasks.
            </p>
          </div>

          <Btn
            type="button"
            onClick={() => navigate("/services")}
            variant="primary"
            className="self-start sm:self-auto"
          >
            Book New Service
            <ArrowForwardIcon fontSize="small" />
          </Btn>
        </div>

        <section className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard
            icon={<AccessTimeIcon />}
            label="Pending"
            value={pendingBookings.length}
            note="Waiting for craftsman"
            color="bg-secondary/10 text-secondary"
          />

          <StatCard
            icon={<EventAvailableIcon />}
            label="Scheduled"
            value={scheduledBookings.length}
            note="Accepted bookings"
            color="bg-primary/10 text-primary"
          />

          <StatCard
            icon={<CheckCircleIcon />}
            label="Completed"
            value={completedBookings.length}
            note="Finished services"
            color="bg-success/10 text-success"
          />
        </section>

        <section className="rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-card sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Booking History
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                View all your requested services in one place.
              </p>
            </div>

            <span className="w-fit rounded-full border border-border-soft bg-background px-4 py-2 text-sm font-bold text-primary shadow-soft">
              {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-border-soft bg-background p-8 text-center shadow-soft">
              <p className="font-bold text-primary">Loading bookings...</p>
              <p className="mt-2 text-sm text-text-muted">
                Please wait while we fetch your service requests.
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <EmptyBookings onBookNow={() => navigate("/services")} />
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  cancelLoadingId={cancelLoadingId}
                  onCancel={handleCancelBooking}
                  onTrack={() => navigate(`/bookings/${booking.id}`)}
                  onReview={() => navigate(`/bookings/${booking.id}/review`)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function BookingCard({
  booking,
  cancelLoadingId,
  onCancel,
  onTrack,
  onReview,
}) {
  const status = booking.status;

  const canCancel = ["PENDING", "WAITING"].includes(status);
  const alreadyReviewed = booking.reviews?.length > 0;
  const canReview = status === "COMPLETED" && !alreadyReviewed;

  const craftsmanName = booking.craftsman?.user?.name;
  const craftsmanPhone = booking.craftsman?.user?.phoneNumber;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-primary/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-14 -left-14 h-36 w-36 rounded-full bg-secondary/20 blur-2xl" />

      <div className="relative z-10">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
              <HomeRepairServiceIcon />
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold leading-tight text-primary">
                {booking.title || "Service Booking"}
              </h3>

              <p className="mt-1 line-clamp-2 text-sm leading-6 text-text-muted">
                {booking.description || "No description provided."}
              </p>
            </div>
          </div>

          <StatusBadge status={status} />
        </div>

        <div className="space-y-3">
          <InfoRow
            icon={<HomeRepairServiceIcon fontSize="small" />}
            label="Service"
            value={`${booking.category?.name || "Category"} - ${
              booking.service?.name || "Service"
            }`}
          />

          <InfoRow
            icon={<LocationOnIcon fontSize="small" />}
            label="Location"
            value={booking.location || "No location provided"}
          />

          <InfoRow
            icon={<PersonIcon fontSize="small" />}
            label="Craftsman"
            value={
              craftsmanName
                ? `${craftsmanName}${craftsmanPhone ? ` · ${craftsmanPhone}` : ""}`
                : "Not assigned yet"
            }
          />

          <InfoRow
            icon={<EventAvailableIcon fontSize="small" />}
            label="Visit Date"
            value={
              booking.scheduledDate
                ? formatDateTime(booking.scheduledDate)
                : "Waiting for craftsman to schedule"
            }
          />
        </div>

        {booking.scheduledDate && status !== "COMPLETED" && (
          <div className="mt-5 rounded-2xl border border-border-soft bg-background p-4 shadow-soft">
            <p className="font-bold text-primary">Craftsman Visit</p>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              The craftsman will fix your task on{" "}
              <span className="font-bold text-text">
                {formatFullDate(booking.scheduledDate)}
              </span>
              .
            </p>
          </div>
        )}

        {status === "COMPLETED" && (
          <div className="mt-5 rounded-2xl border border-success/20 bg-success/10 p-4">
            <p className="font-bold text-success">Service Completed</p>
            <p className="mt-2 text-sm leading-6 text-success">
              This task has been completed. You can leave a review for the
              craftsman.
            </p>
          </div>
        )}

        {status === "UNASSIGNABLE" && (
          <div className="mt-5 rounded-2xl border border-warning/20 bg-warning/10 p-4">
            <p className="font-bold text-warning">
              We’re reviewing your request
            </p>
            <p className="mt-2 text-sm leading-6 text-warning">
              We’re having trouble finding an available craftsman for this
              request. Our team is reviewing it.
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          {status !== "COMPLETED" && (
            <Btn
              type="button"
              onClick={onTrack}
              variant="outline"
              className="flex-1 rounded-xl"
            >
              Track Booking
            </Btn>
          )}

          {canCancel && (
            <Btn
              type="button"
              disabled={cancelLoadingId === booking.id}
              onClick={() => onCancel(booking.id)}
              variant="danger"
              className="flex-1 rounded-xl"
            >
              {cancelLoadingId === booking.id ? "Cancelling..." : "Cancel"}
            </Btn>
          )}

          {canReview && (
            <Btn
              type="button"
              onClick={onReview}
              variant="success"
              className="flex-1 rounded-xl"
            >
              <RateReviewIcon fontSize="small" />
              Review
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-soft bg-background text-primary shadow-soft">
        {icon}
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-text-muted">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold leading-6 text-text">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusStyle = {
    PENDING: "border-secondary/20 bg-secondary/10 text-secondary",
    WAITING: "border-secondary/20 bg-secondary/10 text-secondary",
    UNASSIGNABLE: "border-warning/20 bg-warning/10 text-warning",
    IN_PROGRESS: "border-primary/20 bg-primary/10 text-primary",
    COMPLETED: "border-success/20 bg-success/10 text-success",
    CANCELLED: "border-danger/20 bg-danger/10 text-danger",
  };

  const statusLabel = {
    PENDING: "Pending",
    WAITING: "Waiting",
    UNASSIGNABLE: "Under Review",
    IN_PROGRESS: "Scheduled",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  return (
    <span
      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${
        statusStyle[status] ||
        "border-border-soft bg-background text-text-muted"
      }`}
    >
      {statusLabel[status] || status}
    </span>
  );
}

function StatCard({ icon, label, value, note, color }) {
  return (
    <div className="rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
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

function EmptyBookings({ onBookNow }) {
  return (
    <div className="rounded-3xl border border-dashed border-border-soft bg-card-gradient p-10 text-center shadow-soft">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-gradient text-white shadow-card">
        <EventAvailableIcon sx={{ fontSize: 36 }} />
      </div>

      <h3 className="font-heading text-2xl font-bold text-primary">
        No bookings yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-text-muted">
        You have not requested any services yet. Book a service and your
        bookings will appear here.
      </p>

      <Btn type="button" onClick={onBookNow} variant="primary" className="mt-6">
        Book a Service
      </Btn>
    </div>
  );
}

function formatDateTime(dateValue) {
  return new Date(dateValue).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFullDate(dateValue) {
  return new Date(dateValue).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
