import * as React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../../context/AppContext";
import Btn from "../../components/Btn";

// MUI Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const statusStyles = {
  PENDING: "border-secondary/20 bg-secondary/10 text-secondary",
  WAITING: "border-secondary/20 bg-secondary/10 text-secondary",
  IN_PROGRESS: "border-primary/20 bg-primary/10 text-primary",
  COMPLETED: "border-success/20 bg-success/10 text-success",
  CANCELLED: "border-danger/20 bg-danger/10 text-danger",
};

const statusLabels = {
  PENDING: "Pending",
  WAITING: "Waiting",
  IN_PROGRESS: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const timelineSteps = [
  {
    key: "PENDING",
    label: "Request Created",
    description: "Your service request was created.",
  },
  {
    key: "WAITING",
    label: "Finding Craftsman",
    description: "We sent your request to an available craftsman.",
  },
  {
    key: "IN_PROGRESS",
    label: "Accepted & Scheduled",
    description: "A craftsman accepted your task.",
  },
  {
    key: "COMPLETED",
    label: "Completed",
    description: "The service has been completed.",
  },
];

export default function BookingDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = React.useContext(AppContext);

  const [booking, setBooking] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const fetchBooking = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/user/track/${taskId}`,
      );

      setBooking(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load booking");
      navigate("/bookings");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBooking();
  }, [backendUrl, taskId]);

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center">
          <div className="w-full rounded-2xl border border-border-soft bg-card-gradient p-8 text-center shadow-card">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
              <AccessTimeIcon />
            </div>

            <h1 className="font-heading text-2xl font-bold text-primary">
              Loading Booking
            </h1>

            <p className="mt-2 text-sm leading-6 text-text-muted">
              Please wait while we fetch your booking status.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!booking) return null;

  const assignedCraftsman = booking.assignedCraftsman;
  const isCompleted = booking.status === "COMPLETED";

  const currentIndex = timelineSteps.findIndex(
    (item) => item.key === booking.status,
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-container">
        <Btn
          type="button"
          onClick={() => navigate("/bookings")}
          variant="outline"
          className="mb-6"
        >
          <ArrowBackIcon fontSize="small" />
          Back to bookings
        </Btn>

        <section className="mb-6 overflow-hidden rounded-3xl border border-border-soft bg-card-gradient p-6 shadow-card md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-secondary/20 bg-secondary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                Booking Tracking
              </p>

              <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                Service Request
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
                Track your booking status, schedule, and assigned craftsman
                details.
              </p>
            </div>

            <StatusBadge status={booking.status} />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoCard icon={<AccessTimeIcon />} label="Scheduled Date">
              {booking.scheduledDate
                ? new Date(booking.scheduledDate).toLocaleString()
                : "Not scheduled yet"}
            </InfoCard>

            <InfoCard icon={<CheckCircleIcon />} label="Completed At">
              {booking.completedAt
                ? new Date(booking.completedAt).toLocaleString()
                : "Not completed yet"}
            </InfoCard>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="rounded-3xl border border-border-soft bg-card-gradient p-6 shadow-card md:p-8 xl:col-span-2">
            <h2 className="mb-6 font-heading text-2xl font-bold text-primary">
              Booking Timeline
            </h2>

            <div className="space-y-5">
              {timelineSteps.map((step, index) => {
                const isDone =
                  booking.status === "COMPLETED" ||
                  (currentIndex !== -1 && index <= currentIndex);

                const isCurrent = step.key === booking.status;

                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition ${
                          isDone
                            ? "border-transparent bg-secondary-gradient text-white shadow-card"
                            : "border-border-soft bg-background text-text-muted"
                        }`}
                      >
                        {index + 1}
                      </div>

                      {index !== timelineSteps.length - 1 && (
                        <div
                          className={`mt-2 h-full min-h-[48px] w-px ${
                            isDone ? "bg-secondary/40" : "bg-border-soft"
                          }`}
                        />
                      )}
                    </div>

                    <div className="flex-1 pb-5">
                      <p
                        className={`font-bold ${
                          isCurrent ? "text-primary" : "text-text"
                        }`}
                      >
                        {step.label}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-text-muted">
                        {step.description}
                      </p>

                      {isCurrent && (
                        <span className="mt-3 inline-flex rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">
                          Current status
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="h-fit rounded-3xl border border-border-soft bg-card-gradient p-6 shadow-card md:p-8">
            <h2 className="mb-6 font-heading text-2xl font-bold text-primary">
              Assigned Craftsman
            </h2>

            {assignedCraftsman ? (
              <div className="space-y-4">
                <InfoCard icon={<PersonIcon />} label="Name">
                  {assignedCraftsman.user?.name || "Unknown"}
                </InfoCard>

                <InfoCard icon={<EmailIcon />} label="Email">
                  {assignedCraftsman.user?.email || "No email"}
                </InfoCard>

                <InfoCard icon={<PhoneIcon />} label="Phone">
                  {assignedCraftsman.user?.phoneNumber || "No phone"}
                </InfoCard>

                {assignedCraftsman.user?.phoneNumber && (
                  <a
                    href={`https://wa.me/${assignedCraftsman.user.phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
                      "Hello, I would like to ask about my service request.",
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Btn
                      type="button"
                      variant="success"
                      fullWidth
                      className="min-h-[52px] rounded-xl"
                    >
                      <WhatsAppIcon fontSize="small" />
                      WhatsApp Craftsman
                    </Btn>
                  </a>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border-soft bg-background p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
                  <PersonIcon />
                </div>

                <p className="font-bold text-text">No craftsman assigned yet</p>

                <p className="mt-2 text-sm leading-6 text-text-muted">
                  We are still looking for an available craftsman.
                </p>
              </div>
            )}

            {isCompleted && (
              <Link to={`/bookings/${taskId}/review`} className="mt-5 block">
                <Btn
                  type="button"
                  variant="primary"
                  fullWidth
                  className="min-h-[52px] rounded-xl"
                >
                  <RateReviewIcon fontSize="small" />
                  Leave Review
                </Btn>
              </Link>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`w-fit shrink-0 rounded-full border px-4 py-2 text-xs font-bold ${
        statusStyles[status] ||
        "border-border-soft bg-background text-text-muted"
      }`}
    >
      {statusLabels[status] || status}
    </span>
  );
}

function InfoCard({ icon, label, children }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-background p-4 shadow-soft">
      <div className="mb-3 flex items-center gap-2 text-secondary">
        <span>{icon}</span>

        <p className="text-xs font-bold uppercase tracking-[0.16em]">{label}</p>
      </div>

      <div className="break-words text-sm font-semibold leading-6 text-text">
        {children}
      </div>
    </div>
  );
}
