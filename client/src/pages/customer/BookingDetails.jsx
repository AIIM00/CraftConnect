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
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const statusStyles = {
  PENDING: "bg-[rgba(218,165,32,0.14)] text-accent-hover border-accent/20",
  WAITING: "bg-[rgba(218,165,32,0.16)] text-accent-hover border-accent/25",
  IN_PROGRESS: "bg-[rgba(0,128,128,0.12)] text-teal border-teal/20",
  COMPLETED: "bg-[rgba(85,107,47,0.12)] text-success border-success/20",
  CANCELLED: "bg-[rgba(192,80,77,0.12)] text-error border-error/20",
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
      <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#F7F4ED_0%,#EAE3D4_55%,rgba(169,209,232,0.45)_100%)] px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl rounded-[28px] border border-white/60 bg-white/55 p-8 text-center shadow-soft backdrop-blur-xl">
          <p className="font-extrabold text-primary">
            Loading booking details...
          </p>
          <p className="mt-2 text-sm text-text-muted">
            Please wait while we fetch your booking status.
          </p>
        </div>
      </main>
    );
  }

  if (!booking) {
    return null;
  }

  const assignedCraftsman = booking.assignedCraftsman;
  const isCompleted = booking.status === "COMPLETED";

  return (
    <main className="relative  min-h-screen overflow-hidden bg-[linear-gradient(135deg,#F7F4ED_0%,#EAE3D4_55%,rgba(169,209,232,0.45)_100%)] px-4 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-20 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />

      <div className="p-16 md:p-8 relative z-10 mx-auto max-w-7xl">
        <Btn
          type="button"
          onClick={() => navigate("/bookings")}
          variant="ghost"
          className="mb-6 rounded-full border border-primary/10 bg-white/45 px-5 py-3 font-extrabold text-primary shadow-soft backdrop-blur-md transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/70 hover:text-accent-hover"
        >
          <ArrowBackIcon fontSize="small" />
          Back to bookings
        </Btn>

        <section className="mb-6 overflow-hidden rounded-[32px] border border-white/60 bg-white/55 p-6 shadow-[0_25px_70px_rgba(19,58,99,0.14),inset_0_0_35px_rgba(255,255,255,0.45)] backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-primary/10 bg-white/45 px-4 py-2 font-body text-xs font-bold tracking-[0.18em] text-primary shadow-soft backdrop-blur-md">
                BOOKING TRACKING
              </p>

              <h1 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-[1px] text-primary">
                Service Request
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
                Track your booking status and craftsman details.
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
          <section className="rounded-[32px] border border-white/60 bg-white/55 p-6 shadow-[0_25px_70px_rgba(19,58,99,0.14),inset_0_0_35px_rgba(255,255,255,0.45)] backdrop-blur-xl md:p-8 xl:col-span-2">
            <h2 className="mb-6 font-heading text-2xl font-extrabold text-primary">
              Booking Timeline
            </h2>

            <div className="space-y-5">
              {timelineSteps.map((step, index) => {
                const currentIndex = timelineSteps.findIndex(
                  (item) => item.key === booking.status,
                );

                const isDone =
                  booking.status === "COMPLETED" || index <= currentIndex;

                const isCurrent = step.key === booking.status;

                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-extrabold transition ${
                          isDone
                            ? "border-[rgba(247,244,237,0.65)] bg-gold-gradient text-primary-dark shadow-[0_0_24px_rgba(218,165,32,0.25)]"
                            : "border-primary/10 bg-white/60 text-text-muted"
                        }`}
                      >
                        {index + 1}
                      </div>

                      {index !== timelineSteps.length - 1 && (
                        <div
                          className={`mt-2 h-full min-h-[48px] w-px ${
                            isDone ? "bg-accent/50" : "bg-primary/10"
                          }`}
                        />
                      )}
                    </div>

                    <div className="flex-1 pb-5">
                      <p
                        className={`font-extrabold ${
                          isCurrent ? "text-primary" : "text-text"
                        }`}
                      >
                        {step.label}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-text-muted">
                        {step.description}
                      </p>

                      {isCurrent && (
                        <span className="mt-3 inline-flex rounded-full border border-primary/10 bg-white/55 px-3 py-1 text-xs font-bold text-primary shadow-sm backdrop-blur-md">
                          Current status
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="h-fit rounded-[32px] border border-white/60 bg-white/55 p-6 shadow-[0_25px_70px_rgba(19,58,99,0.14),inset_0_0_35px_rgba(255,255,255,0.45)] backdrop-blur-xl md:p-8">
            <h2 className="mb-6 font-heading text-2xl font-extrabold text-primary">
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
                      variant="ghost"
                      className="min-h-[52px] w-full rounded-full border border-success/20 bg-success/10 px-5 py-3 font-extrabold text-success shadow-none transition hover:-translate-y-0.5 hover:bg-success/20"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        className="h-5 w-5 fill-current"
                      >
                        <path d="M16.01 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.59 4.47 1.72 6.41L3.1 29l6.75-1.77a12.75 12.75 0 0 0 6.16 1.57c7.06 0 12.8-5.74 12.8-12.8s-5.74-12.8-12.8-12.8Zm0 23.43c-1.94 0-3.84-.52-5.5-1.5l-.39-.23-4.01 1.05 1.07-3.91-.25-.4a10.58 10.58 0 0 1-1.55-5.49c0-5.86 4.77-10.63 10.63-10.63s10.63 4.77 10.63 10.63-4.77 10.48-10.63 10.48Zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.09 1.31 3.3c.16.21 2.27 3.47 5.5 4.86.77.33 1.37.53 1.84.68.77.24 1.47.21 2.02.13.62-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
                      </svg>
                      WhatsApp Craftsman
                    </Btn>
                  </a>
                )}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-primary/20 bg-white/45 p-5 text-center shadow-soft backdrop-blur-xl">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(247,244,237,0.65)] bg-[linear-gradient(135deg,#A9D1E8_0%,#DAA520_100%)] text-primary-dark shadow-[0_0_24px_rgba(218,165,32,0.25)]">
                  <PersonIcon />
                </div>

                <p className="font-extrabold text-text">
                  No craftsman assigned yet
                </p>

                <p className="mt-2 text-sm leading-6 text-text-muted">
                  We are still looking for an available craftsman.
                </p>
              </div>
            )}

            {isCompleted && (
              <Link to={`/bookings/${taskId}/review`} className="mt-5 block">
                <Btn
                  type="button"
                  variant="ghost"
                  className="min-h-[52px] w-full rounded-full border border-success/20 bg-success/10 px-5 py-3 font-extrabold text-success shadow-none transition hover:-translate-y-0.5 hover:bg-success/20"
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
      className={`w-fit shrink-0 rounded-full border px-4 py-2 text-xs font-extrabold ${
        statusStyles[status] || "border-gray-200 bg-gray-100 text-text-muted"
      }`}
    >
      {statusLabels[status] || status}
    </span>
  );
}

function InfoCard({ icon, label, children }) {
  return (
    <div className="rounded-[24px] border border-white/60 bg-white/55 p-4 shadow-sm backdrop-blur-md">
      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.08em] text-text-muted">
        {label}
      </p>

      <div className="flex items-center gap-2 text-sm font-semibold leading-6 text-text">
        <span className="text-primary">{icon}</span>
        <span>{children}</span>
      </div>
    </div>
  );
}
