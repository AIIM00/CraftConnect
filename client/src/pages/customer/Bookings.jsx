import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Btn from "../../components/Btn";

// MUI Icons
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
        {
          withCredentials: true,
        },
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

  const scheduledBookings = bookings.filter((booking) =>
    ["IN_PROGRESS"].includes(booking.status),
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "COMPLETED",
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#F7F4ED_0%,#EAE3D4_55%,rgba(169,209,232,0.45)_100%)] px-4 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-20 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-primary/10 bg-white/45 px-4 py-2 font-body text-xs font-bold tracking-[0.18em] text-primary shadow-soft backdrop-blur-md">
              CUSTOMER WORKSPACE
            </p>

            <h1 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-[1px] text-primary">
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
            variant="ghost"
            className="self-start rounded-full border border-[rgba(247,244,237,0.65)] bg-gold-gradient px-6 py-3 font-extrabold text-surface shadow-[0_12px_26px_rgba(218,165,32,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(218,165,32,0.36)] sm:self-auto"
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
            color="bg-[rgba(218,165,32,0.16)] text-accent-hover"
          />

          <StatCard
            icon={<EventAvailableIcon />}
            label="Scheduled"
            value={scheduledBookings.length}
            note="Accepted bookings"
            color="bg-[rgba(0,128,128,0.14)] text-teal"
          />

          <StatCard
            icon={<CheckCircleIcon />}
            label="Completed"
            value={completedBookings.length}
            note="Finished services"
            color="bg-[rgba(85,107,47,0.14)] text-success"
          />
        </section>

        <section className="rounded-[32px] border border-white/60 bg-white/55 p-5 shadow-[0_25px_70px_rgba(19,58,99,0.14),inset_0_0_35px_rgba(255,255,255,0.45)] backdrop-blur-xl sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-extrabold text-primary">
                Booking History
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                View all your requested services in one place.
              </p>
            </div>

            <span className="w-fit rounded-full border border-primary/10 bg-white/60 px-4 py-2 text-sm font-extrabold text-primary shadow-soft backdrop-blur-md">
              {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="rounded-[28px] border border-white/60 bg-white/55 p-8 text-center shadow-soft backdrop-blur-xl">
              <p className="font-extrabold text-primary">Loading bookings...</p>
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
  const canReview = status === "COMPLETED";

  const craftsmanName = booking.craftsman?.user?.name;
  const craftsmanPhone = booking.craftsman?.user?.phoneNumber;

  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-[linear-gradient(145deg,rgba(255,255,255,0.72),rgba(247,244,237,0.55))] p-5 shadow-[0_18px_45px_rgba(19,58,99,0.12),inset_0_0_35px_rgba(255,255,255,0.45)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-white/75 hover:shadow-[0_25px_60px_rgba(19,58,99,0.18)]">
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-accent/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-14 -left-14 h-36 w-36 rounded-full bg-teal/15 blur-2xl" />

      <div className="relative z-10">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[rgba(247,244,237,0.65)] bg-[linear-gradient(135deg,#A9D1E8_0%,#DAA520_100%)] text-primary-dark shadow-[0_0_24px_rgba(218,165,32,0.25)]">
              <HomeRepairServiceIcon />
            </div>

            <div>
              <h3 className="font-heading text-xl font-extrabold leading-tight text-primary">
                {booking.title || "Service Booking"}
              </h3>

              <p className="mt-1 line-clamp-2 text-sm leading-6 text-text-muted">
                {booking.description}
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
                ? `${craftsmanName}${
                    craftsmanPhone ? ` · ${craftsmanPhone}` : ""
                  }`
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
          <div className="mt-5 rounded-[24px] border border-white/60 bg-white/55 p-4 backdrop-blur-md">
            <p className="font-extrabold text-primary">Craftsman Visit</p>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              The craftsman will fix your task on{" "}
              <span className="font-extrabold text-text">
                {formatFullDate(booking.scheduledDate)}
              </span>
              .
            </p>
          </div>
        )}

        {status === "COMPLETED" && (
          <div className="mt-5 rounded-[24px] border border-success/20 bg-success/10 p-4">
            <p className="font-extrabold text-success">Service Completed</p>
            <p className="mt-2 text-sm leading-6 text-success">
              This task has been completed. You can leave a review for the
              craftsman.
            </p>
          </div>
        )}
        {status === "UNASSIGNABLE" && (
          <div className="mt-5 rounded-[24px] border border-orange-200 bg-orange-50 p-4">
            <p className="font-extrabold text-orange-700">
              We’re reviewing your request
            </p>
            <p className="mt-2 text-sm leading-6 text-orange-700">
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
              variant="ghost"
              className="flex-1 rounded-full border border-primary/10 bg-white/60 px-5 py-3 font-extrabold text-primary shadow-soft backdrop-blur-md transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/80 hover:text-accent-hover"
            >
              Track Booking
            </Btn>
          )}

          {canCancel && (
            <Btn
              type="button"
              disabled={cancelLoadingId === booking.id}
              onClick={() => onCancel(booking.id)}
              variant="ghost"
              className="flex-1 rounded-full border border-error/20 bg-error/10 px-5 py-3 font-extrabold text-error shadow-none transition hover:-translate-y-0.5 hover:bg-error/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-y-0"
            >
              {cancelLoadingId === booking.id ? "Cancelling..." : "Cancel"}
            </Btn>
          )}

          {canReview && (
            <Btn
              type="button"
              onClick={onReview}
              variant="ghost"
              className="flex-1 rounded-full border border-success/20 bg-success/10 px-5 py-3 font-extrabold text-success shadow-none transition hover:-translate-y-0.5 hover:bg-success/20"
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
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-white/60 text-primary shadow-sm">
        {icon}
      </div>

      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-text-muted">
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
    PENDING: "bg-[rgba(218,165,32,0.14)] text-accent-hover border-accent/20",
    WAITING: "bg-[rgba(218,165,32,0.16)] text-accent-hover border-accent/25",
    UNASSIGNABLE: "bg-orange-100 text-orange-700 border-orange-200",
    IN_PROGRESS: "bg-[rgba(0,128,128,0.12)] text-teal border-teal/20",
    COMPLETED: "bg-[rgba(85,107,47,0.12)] text-success border-success/20",
    CANCELLED: "bg-[rgba(192,80,77,0.12)] text-error border-error/20",
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
      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-extrabold ${
        statusStyle[status] || "border-gray-200 bg-gray-100 text-text-muted"
      }`}
    >
      {statusLabel[status] || status}
    </span>
  );
}

function StatCard({ icon, label, value, note, color }) {
  return (
    <div className="rounded-[28px] border border-white/60 bg-white/55 p-5 shadow-[0_18px_45px_rgba(19,58,99,0.10),inset_0_0_30px_rgba(255,255,255,0.4)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(19,58,99,0.14)]">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${color}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm font-bold text-text-muted">{label}</p>
          <p className="mt-1 text-3xl font-extrabold text-primary">{value}</p>
          <p className="mt-1 text-xs text-text-muted">{note}</p>
        </div>
      </div>
    </div>
  );
}

function EmptyBookings({ onBookNow }) {
  return (
    <div className="rounded-[28px] border border-dashed border-primary/20 bg-white/45 p-8 text-center shadow-soft backdrop-blur-xl">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[28px] border border-[rgba(247,244,237,0.65)] bg-[linear-gradient(135deg,#A9D1E8_0%,#DAA520_100%)] text-primary-dark shadow-[0_0_28px_rgba(218,165,32,0.28)]">
        <EventAvailableIcon sx={{ fontSize: 36 }} />
      </div>

      <h3 className="font-heading text-2xl font-extrabold text-primary">
        No bookings yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-text-muted">
        You have not requested any services yet. Book a service and your
        bookings will appear here.
      </p>

      <Btn
        type="button"
        onClick={onBookNow}
        variant="ghost"
        className="mt-6 rounded-full border border-[rgba(247,244,237,0.65)] bg-gold-gradient px-6 py-3 font-extrabold text-surface shadow-[0_12px_26px_rgba(218,165,32,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(218,165,32,0.36)]"
      >
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
