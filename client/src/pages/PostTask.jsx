import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const PostTask = () => {
  const { backendUrl, isLoggedIn } = React.useContext(AppContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  const [description, setDescription] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const categoryName = state?.categoryName;
  const serviceName = state?.serviceName;

  React.useEffect(() => {
    if (!categoryName || !serviceName) {
      toast.error("Please choose a service first");
      navigate("/services");
    }
  }, [categoryName, serviceName, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("Please describe your task");
      return;
    }

    if (!location.trim()) {
      toast.error("Please enter your location");
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
          location,
        },
        {
          withCredentials: true,
        },
      );

      toast.success(data.message || "Task booked successfully");
      navigate("/my-bookings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-bg px-4 sm:px-8 lg:px-16 py-14">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
            <p className="text-sm font-semibold text-primary-light mb-2">
              Booking Details
            </p>

            <h1 className="text-3xl font-bold text-primary mb-6">
              Book {serviceName}
            </h1>

            <div className="bg-bg rounded-2xl p-4 mb-6">
              <p className="text-sm text-text-muted">Category</p>
              <p className="font-bold text-primary">{categoryName}</p>
              <p className="text-sm text-text-muted mt-3">Selected Service</p>
              <p className="font-bold text-primary">{serviceName}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Describe the task
                </label>

                <textarea
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Example: I need someone to fix a leaking kitchen sink..."
                  className="w-full rounded-2xl bg-bg border border-gray-200 px-4 py-3 outline-none focus:border-accent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Location
                </label>

                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your address or area"
                  className="w-full rounded-2xl bg-bg border border-gray-200 px-4 py-3 outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-accent text-white font-bold hover:bg-accent-hover transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default PostTask;
