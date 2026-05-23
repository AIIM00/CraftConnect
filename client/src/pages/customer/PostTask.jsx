import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

// Components
import Btn from "../../components/Btn";
import LocationPicker from "../../components/LocationPicker";

// MUI Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import CategoryIcon from "@mui/icons-material/Category";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const PostTask = () => {
  const { backendUrl, isLoggedIn } = React.useContext(AppContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  const [description, setDescription] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState(null);

  const categoryName = state?.categoryName;
  const serviceName = state?.serviceName;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("Please describe your task");
      return;
    }

    if (!selectedLocation) {
      toast.error("Please select your location on the map");
      return;
    }

    if (!isLoggedIn) {
      toast.error("You must be logged in to book a service");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/user/book`,
        {
          categoryName,
          serviceName,
          description,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          location:
            selectedLocation.location ||
            selectedLocation.locationName ||
            selectedLocation.address ||
            "",
        },
        {
          withCredentials: true,
        },
      );

      toast.success(data.message || "Task booked successfully");
      navigate("/bookings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#F7F4ED_0%,#EAE3D4_55%,rgba(169,209,232,0.45)_100%)] px-4 py-24 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-20 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <Btn
          type="button"
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 rounded-full border border-primary/10 bg-white/45 px-5 py-3 font-extrabold text-primary shadow-soft backdrop-blur-md transition hover:-translate-y-0.5  hover:bg-white/70 hover:text-gold hover:shadow-[0_0_26px_rgba(19,58,99,0.18)]"
        >
          <ArrowBackIcon fontSize="small" />
          Back
        </Btn>

        <section className="overflow-hidden rounded-[36px] border border-white/60 bg-white/55 p-6 shadow-[0_25px_70px_rgba(19,58,99,0.14),inset_0_0_35px_rgba(255,255,255,0.45)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] border border-[rgba(247,244,237,0.65)] bg-[linear-gradient(135deg,#A9D1E8_0%,#DAA520_100%)] text-surface shadow-[0_0_28px_rgba(218,165,32,0.28)]">
              <HomeRepairServiceIcon sx={{ fontSize: 38 }} />
            </div>

            <p className="mb-3 inline-flex rounded-full border border-primary/10 bg-white/45 px-4 py-2 font-body text-xs font-bold tracking-[0.18em] text-primary shadow-soft backdrop-blur-md">
              BOOKING DETAILS
            </p>

            <h1 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-[1px] text-primary">
              Book {serviceName || "Service"}
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
              Tell us what you need, choose your location, and we’ll send your
              request to a trusted craftsman.
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SummaryCard
              icon={<CategoryIcon className="text-surface" />}
              label="Category"
              value={categoryName || "Not selected"}
            />

            <SummaryCard
              icon={<HomeRepairServiceIcon className="text-surface" />}
              label="Selected Service"
              value={serviceName || "Not selected"}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-3 flex items-center gap-2 text-sm font-extrabold text-primary">
                <DescriptionIcon fontSize="small" />
                Describe the task
              </label>

              <textarea
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: I need someone to fix a leaking kitchen sink..."
                className="w-full resize-none rounded-[24px] border border-white/60 bg-white/55 px-5 py-4 text-text outline-none shadow-sm backdrop-blur-md transition placeholder:text-text-muted focus:border-accent/50 focus:bg-white/75 focus:shadow-[0_0_26px_rgba(218,165,32,0.18)]"
              />
            </div>

            <div>
              <div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/55 p-8 shadow-sm backdrop-blur-md">
                <label className="mb-3 flex items-center gap-2 text-sm font-extrabold text-primary">
                  <LocationOnIcon fontSize="small" />
                  Select your location
                </label>

                <div className="overflow-hidden rounded-[22px] border border-primary/10">
                  <LocationPicker
                    value={selectedLocation}
                    onChange={setSelectedLocation}
                    defaultCenter={[34.436, 35.835]}
                    zoom={13}
                    height="350px"
                  />
                </div>

                {selectedLocation && (
                  <div className="mt-4 rounded-[20px] border border-success/20 bg-success/10 p-4 text-sm text-success">
                    <p className="font-extrabold">Location selected</p>
                    <p className="mt-1 leading-6">
                      {selectedLocation.location ||
                        selectedLocation.locationName ||
                        selectedLocation.address ||
                        "Your selected map location is ready."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Btn
              type="submit"
              disabled={loading}
              variant="ghost"
              className="min-h-[56px] w-full rounded-full border border-[rgba(247,244,237,0.65)] bg-gold-gradient px-6 py-3 font-extrabold text-surface shadow-[0_14px_30px_rgba(218,165,32,0.28)] transition hover:text-surface hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(218,165,32,0.38)] disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-y-0"
            >
              <CheckCircleIcon fontSize="small" />
              {loading ? "Booking..." : "Confirm Booking"}
            </Btn>
          </form>
        </section>
      </div>
    </main>
  );
};

function SummaryCard({ icon, label, value }) {
  return (
    <div className="rounded-[24px] border border-white/60 bg-white/55 p-5 shadow-sm backdrop-blur-md">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(247,244,237,0.65)] bg-[linear-gradient(135deg,#A9D1E8_0%,#DAA520_100%)] text-primary-dark shadow-[0_0_24px_rgba(218,165,32,0.22)]">
        {icon}
      </div>

      <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-text-muted">
        {label}
      </p>

      <p className="mt-1 font-heading text-xl font-extrabold text-primary">
        {value}
      </p>
    </div>
  );
}

export default PostTask;
