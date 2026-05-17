import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Btn from "../../components/Btn";
//MUI COMPONENTS
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
    ["PENDING", "WAITING"].includes(booking.status),
  );

  const scheduledBookings = bookings.filter((booking) =>
    ["IN_PROGRESS"].includes(booking.status),
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "COMPLETED",
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-semibold text-primary-light mb-2">
            Customer Workspace
          </p>

          <h1 className="text-3xl font-extrabold text-primary">My Bookings</h1>

          <p className="text-text-muted mt-2">
            Track your service requests, scheduled visits, and completed tasks.
          </p>
        </div>

        <Btn
          type="button"
          onClick={() => navigate("/services")}
          variant="primary"
          className="rounded-2xl px-6 py-3 font-bold"
        >
          Book New Service
          <ArrowForwardIcon fontSize="small" />
        </Btn>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <StatCard
          icon={<AccessTimeIcon />}
          label="Pending"
          value={pendingBookings.length}
          note="Waiting for craftsman"
          color="bg-orange-50 text-orange-600"
        />

        <StatCard
          icon={<EventAvailableIcon />}
          label="Scheduled"
          value={scheduledBookings.length}
          note="Accepted bookings"
          color="bg-blue-50 text-blue-600"
        />

        <StatCard
          icon={<CheckCircleIcon />}
          label="Completed"
          value={completedBookings.length}
          note="Finished services"
          color="bg-green-50 text-green-600"
        />
      </section>

      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-text">
              Booking History
            </h2>
            <p className="text-sm text-text-muted mt-1">
              View all your requested services in one place.
            </p>
          </div>

          <span className="text-sm font-bold text-primary bg-bg px-4 py-2 rounded-2xl">
            {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-bg p-6 text-center">
            <p className="font-bold text-primary">Loading bookings...</p>
            <p className="text-sm text-text-muted mt-2">
              Please wait while we fetch your service requests.
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <EmptyBookings onBookNow={() => navigate("/services")} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
    <div className="rounded-3xl border border-gray-100 bg-bg p-5 hover:bg-gray-50 transition">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <HomeRepairServiceIcon />
          </div>

          <div>
            <h3 className="font-extrabold text-primary">
              {booking.title || "Service Booking"}
            </h3>

            <p className="text-sm text-text-muted mt-1 line-clamp-2">
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
        <div className="mt-5 rounded-3xl bg-white border border-gray-100 p-4">
          <p className="font-bold text-primary">Craftsman Visit</p>
          <p className="text-sm text-text-muted mt-2">
            The craftsman will fix your task on{" "}
            <span className="font-bold text-text">
              {formatFullDate(booking.scheduledDate)}
            </span>
            .
          </p>
        </div>
      )}

      {status === "COMPLETED" && (
        <div className="mt-5 rounded-3xl bg-green-50 border border-green-100 p-4">
          <p className="font-bold text-green-700">Service Completed</p>
          <p className="text-sm text-green-700 mt-2">
            This task has been completed. You can leave a review for the
            craftsman.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-5">
        {status !== "COMPLETED" && (
          <Btn
            type="button"
            onClick={onTrack}
            variant="primary"
            className="flex-1 rounded-2xl px-5 py-3 font-bold"
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
            className="flex-1 rounded-2xl px-5 py-3 font-bold disabled:opacity-60"
          >
            {cancelLoadingId === booking.id ? "Cancelling..." : "Cancel"}
          </Btn>
        )}

        {canReview && (
          <Btn
            type="button"
            onClick={onReview}
            variant="success"
            className="flex-1 rounded-2xl px-5 py-3 font-bold"
          >
            <RateReviewIcon fontSize="small" />
            Review
          </Btn>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div>
        <p className="text-xs font-bold text-text-muted">{label}</p>
        <p className="text-sm font-semibold text-text mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusStyle = {
    PENDING: "bg-orange-100 text-orange-700",
    WAITING: "bg-yellow-100 text-yellow-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  const statusLabel = {
    PENDING: "Pending",
    WAITING: "Waiting",
    IN_PROGRESS: "Scheduled",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  return (
    <span
      className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${
        statusStyle[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {statusLabel[status] || status}
    </span>
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

      <div>
        <p className="text-sm font-semibold text-text-muted">{label}</p>
        <p className="text-3xl font-extrabold text-text mt-1">{value}</p>
        <p className="text-xs text-text-muted mt-1">{note}</p>
      </div>
    </div>
  );
}

function EmptyBookings({ onBookNow }) {
  return (
    <div className="rounded-3xl bg-bg p-8 text-center">
      <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
        <EventAvailableIcon sx={{ fontSize: 36 }} />
      </div>

      <h3 className="text-xl font-extrabold text-primary">No bookings yet</h3>

      <p className="text-text-muted mt-2 max-w-md mx-auto">
        You have not requested any services yet. Book a service and your
        bookings will appear here.
      </p>

      <Btn
        type="button"
        onClick={onBookNow}
        variant="primary"
        className="mt-6 rounded-2xl px-6 py-3 font-bold"
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
