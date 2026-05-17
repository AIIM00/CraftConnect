import * as React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

import Btn from "../../components/Btn";
// MUI Components
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RateReviewIcon from "@mui/icons-material/RateReview";

const statusStyles = {
  PENDING: "bg-orange-100 text-orange-600",
  WAITING: "bg-yellow-100 text-yellow-700",
  IN_PROGRESS: "bg-blue-100 text-blue-600",
  COMPLETED: "bg-green-100 text-green-600",
  CANCELLED: "bg-red-100 text-red-600",
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
    return <p className="text-text-muted">Loading booking details...</p>;
  }

  if (!booking) {
    return null;
  }

  const assignedCraftsman = booking.assignedCraftsman;
  const isCompleted = booking.status === "COMPLETED";

  return (
    <div className=" p-2 max-w-5xl mx-auto">
      <Btn
        type="button"
        onClick={() => navigate("/bookings")}
        variant="ghost"
        className="self-start lg:self-auto border-none bg-transparent px-0 py-0 text-primary font-semibold shadow-none hover:bg-transparent hover:text-primary-light"
      >
        <ArrowBackIcon fontSize="small" />
        Back to bookings
      </Btn>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary-light mb-2">
              Booking Tracking
            </p>

            <h1 className="text-3xl font-extrabold text-primary">
              Service Request
            </h1>

            <p className="text-text-muted mt-2">
              Track your booking status and craftsman details.
            </p>
          </div>

          <span
            className={`w-fit text-xs font-bold px-4 py-2 rounded-full ${
              statusStyles[booking.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {booking.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <InfoCard icon={<AccessTimeIcon />} label="Scheduled Date">
            {booking.scheduledDate
              ? new Date(booking.scheduledDate).toLocaleString()
              : "Not scheduled yet"}
          </InfoCard>

          <InfoCard icon={<AccessTimeIcon />} label="Completed At">
            {booking.completedAt
              ? new Date(booking.completedAt).toLocaleString()
              : "Not completed yet"}
          </InfoCard>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-extrabold text-text mb-6">
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
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
                      isDone
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-text-muted"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="pb-5 border-b border-gray-100 flex-1">
                    <p
                      className={`font-bold ${
                        isCurrent ? "text-primary" : "text-text"
                      }`}
                    >
                      {step.label}
                    </p>

                    <p className="text-sm text-text-muted mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 h-fit">
          <h2 className="text-xl font-extrabold text-text mb-6">
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
              <div>
                {assignedCraftsman.user?.phoneNumber && (
                  <a
                    href={`https://wa.me/${assignedCraftsman.user.phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
                      "Hello, I would like to ask about my service request.",
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex h-16 w-full max-w-md items-center overflow-hidden rounded-full   p-1 shadow-lg transition-all duration-500 hover:bg-[#7CFF1E]"
                  >
                    <Btn
                      type="button"
                      variant="success"
                      className="w-full px-6 py-3 font-bold"
                    >
                      {" "}
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
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-bg text-center">
              <p className="font-bold text-text">No craftsman assigned yet</p>
              <p className="text-sm text-text-muted mt-2">
                We are still looking for an available craftsman.
              </p>
            </div>
          )}

          {isCompleted && (
            <Link
              to={`/bookings/${taskId}/review`}
              className="group relative mt-4 flex h-16 w-full max-w-md items-center overflow-hidden rounded-full border-[6px] border-black bg-black p-1 shadow-lg transition-all duration-500 hover:bg-[#7CFF1E]"
            >
              <span className="flex h-full w-36 items-center justify-center rounded-full bg-[#7CFF1E] transition-all duration-500 group-hover:w-full">
                <RateReviewIcon className="text-black" />
              </span>

              <span className="absolute left-40 text-xl font-semibold text-white transition-all duration-300 group-hover:opacity-0">
                Leave Review
              </span>

              <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                <RateReviewIcon className="text-black" />
              </span>
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, children }) {
  return (
    <div className="p-4 rounded-2xl bg-bg">
      <p className="text-xs font-bold text-text-muted uppercase mb-2">
        {label}
      </p>

      <div className="flex items-center gap-2 text-sm font-semibold text-text">
        <span className="text-primary">{icon}</span>
        <span>{children}</span>
      </div>
    </div>
  );
}
