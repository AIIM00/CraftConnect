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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!description.trim()) {
      toast.error("Please describe your task");
      return;
    }

    if (!selectedLocation) {
      toast.error("Please select your location");
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
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-28 bottom-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <Btn
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowBackIcon fontSize="small" />
          Back
        </Btn>

        <section className="overflow-hidden rounded-3xl border border-border-soft bg-card-gradient shadow-card">
          {/* HERO */}
          <div className="relative overflow-hidden bg-primary-gradient px-6 py-10 text-white sm:px-8 lg:px-10">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

            <div className="relative z-10 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-white shadow-card backdrop-blur-sm">
                <HomeRepairServiceIcon sx={{ fontSize: 38 }} />
              </div>

              <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                Booking Details
              </p>

              <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
                Book {serviceName || "Service"}
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                Describe your task, choose your location, and we’ll connect you
                with a trusted craftsman.
              </p>
            </div>
          </div>

          {/* CONTENT */}
          <div className="space-y-8 p-5 sm:p-8 lg:p-10">
            {/* SUMMARY */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <SummaryCard
                icon={<CategoryIcon />}
                label="Category"
                value={categoryName || "Not selected"}
              />

              <SummaryCard
                icon={<HomeRepairServiceIcon />}
                label="Selected Service"
                value={serviceName || "Not selected"}
              />
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* DESCRIPTION */}
              <section className="rounded-3xl border border-border-soft bg-background p-5 shadow-soft">
                <label className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-primary">
                  <DescriptionIcon fontSize="small" />
                  Describe the task
                </label>

                <textarea
                  rows={6}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Example: I need someone to fix a leaking kitchen sink..."
                  className="w-full resize-none rounded-2xl border border-border-soft bg-card-gradient px-5 py-4 text-sm text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                />

                <p className="mt-3 text-xs text-text-muted">
                  Provide as many details as possible for better assignment.
                </p>
              </section>

              {/* LOCATION */}
              <section className="rounded-3xl border border-border-soft bg-background p-5 shadow-soft">
                <label className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-primary">
                  <LocationOnIcon fontSize="small" />
                  Select your location
                </label>

                <div className="overflow-hidden rounded-2xl border border-border-soft shadow-soft">
                  <LocationPicker
                    value={selectedLocation}
                    onChange={setSelectedLocation}
                    defaultCenter={[34.436, 35.835]}
                    zoom={13}
                    height="380px"
                  />
                </div>

                {selectedLocation && (
                  <div className="mt-5 rounded-2xl border border-success/20 bg-success/10 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success text-white shadow-soft">
                        <CheckCircleIcon fontSize="small" />
                      </div>

                      <div>
                        <p className="font-bold text-success">
                          Location Selected
                        </p>

                        <p className="mt-1 text-sm leading-6 text-success">
                          {selectedLocation.location ||
                            selectedLocation.locationName ||
                            selectedLocation.address ||
                            "Your selected location is ready."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* SUBMIT */}
              <Btn
                type="submit"
                disabled={loading}
                variant="primary"
                fullWidth
                className="min-h-[58px] rounded-2xl text-base font-bold"
              >
                <CheckCircleIcon fontSize="small" />

                {loading ? "Booking Service..." : "Confirm Booking"}
              </Btn>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

function SummaryCard({ icon, label, value }) {
  return (
    <div className="rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
        {icon}
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">
        {label}
      </p>

      <h3 className="mt-2 font-heading text-xl font-bold text-primary">
        {value}
      </h3>
    </div>
  );
}

export default PostTask;
