import * as React from "react";

import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

//Components
import TaskDetails from "../../components/TasksDetails";
import Btn from "../../components/Btn";

//MUI Icons
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    backendUrl,
    userData,
    statusStyles,
    availability,
    availabilityLoading,
    toggleCraftsmanAvailability,
  } = React.useContext(AppContext);

  const [tasks, setTasks] = React.useState([]);
  const [counts, setCounts] = React.useState({
    all: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState("All");
  const [back, setBack] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [scheduledDate, setScheduledDate] = React.useState("");
  const [reviews, setReviews] = React.useState([]);
  const [reviewStats, setReviewStats] = React.useState({
    totalReviews: 0,
    averageRating: 0,
  });
  const [reviewsLoading, setReviewsLoading] = React.useState(true);

  const isAvailable =
    userData?.craftsman?.isAvailable !== undefined
      ? userData.craftsman.isAvailable
      : availability;

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${backendUrl}/api/craftsman/tasks`, {
        withCredentials: true,
      });

      if (data.success) {
        setTasks(data.tasks.all);
        setCounts(data.counts);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };
  //Fetch Reviews
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);

      const { data } = await axios.get(`${backendUrl}/api/craftsman/reviews`, {
        withCredentials: true,
      });

      if (data.success) {
        setReviews(data.reviews || []);
        setReviewStats(
          data.stats || {
            totalReviews: data.reviews?.length || 0,
            averageRating: 0,
          },
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setReviewsLoading(false);
    }
  };
  React.useEffect(() => {
    fetchTasks();
    fetchReviews();
  }, [backendUrl]);

  const openTaskDetails = (task) => {
    setSelectedTask(task);
    setBack(true);
  };

  const closeTaskDetails = () => {
    setBack(false);
    setSelectedTask(null);
    setScheduledDate("");
  };

  const handleCompleteTask = async (taskId) => {
    try {
      setActionLoading(true);

      const { data } = await axios.patch(
        `${backendUrl}/api/craftsman/tasks/${taskId}/complete`,
        {},
        { withCredentials: true },
      );

      toast.success(data.message || "Task completed successfully");

      setSelectedTask(null);
      setScheduledDate("");

      await fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete task");
    } finally {
      setActionLoading(false);
    }
  };
  const handleTaskAction = async (taskId, action, selectedScheduledDate) => {
    try {
      if (action === "ACCEPT" && !selectedScheduledDate) {
        toast.error(
          "Please select a scheduled date before accepting the task.",
        );
        return;
      }

      setActionLoading(true);

      const payload =
        action === "ACCEPT"
          ? { action, scheduledDate: selectedScheduledDate }
          : { action };

      const { data } = await axios.patch(
        `${backendUrl}/api/craftsman/tasks/${taskId}/respond`,
        payload,
        { withCredentials: true },
      );

      toast.success(data.message || "Task updated successfully");

      closeTaskDetails();
      await fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter(
          (task) => task.status === filter.toUpperCase().replace(" ", "_"),
        );

  if (loading) {
    return <p className="text-text-muted">Loading dashboard...</p>;
  }

  return (
    <section className="min-h-screen bg-bg text-text">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="xl:col-span-2">
          {/* Welcome + Availability */}
          <div className="m-12 flex flex-row gap-6 lg:items-start lg:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-text">
                {`Welcome back, ${userData.name}!`}
              </h2>
              <p className="text-text-muted mt-2">
                Here’s what’s happening with your work today.
              </p>
            </div>

            <div className="w-full max-w-[280px] lg:ml-auto xl:translate-x-8">
              <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-2xl shadow-slate-300/40 backdrop-blur-xl">
                <div
                  className={`mb-4 rounded-2xl p-4 ${
                    isAvailable ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-3 w-3 rounded-full ${
                          isAvailable ? "bg-green-500" : "bg-red-500"
                        }`}
                      />

                      <p
                        className={`font-extrabold ${
                          isAvailable ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {isAvailable ? "Online" : "Offline"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-text-muted">
                    {isAvailable
                      ? "You are available for new tasks."
                      : "You are currently not receiving new tasks."}
                  </p>
                </div>

                <Btn
                  type="button"
                  onClick={toggleCraftsmanAvailability}
                  disabled={availabilityLoading}
                  variant={isAvailable ? "danger" : "success"}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-bold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <PowerSettingsNewIcon fontSize="small" />
                  {availabilityLoading
                    ? "Updating..."
                    : isAvailable
                      ? "Go Offline"
                      : "Go Online"}
                </Btn>
              </div>
            </div>
          </div>

          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <StatCard
              icon={<AssignmentIcon />}
              label="All Tasks"
              value={counts.all}
              note={`${counts.pending} pending · ${counts.inProgress} in progress`}
              color="bg-blue-50 text-blue-600"
            />

            <StatCard
              icon={<CheckCircleIcon />}
              label="Completed Tasks"
              value={`${counts.completed}`}
              color="bg-green-50 text-green-600"
            />
          </section>

          {/* My Tasks */}
          <div className="perspective">
            <div
              className={`relative w-full transition-transform duration-700 transform-style-preserve-3d ${
                back ? "rotate-y-180" : ""
              }`}
            >
              {/* Front */}
              <div className="backface-hidden bg-surface rounded-3xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-extrabold text-text">My Tasks</h3>
                </div>

                <div className="flex gap-6 border-b border-gray-100 mb-4 overflow-x-auto">
                  {["All", "Pending", "In Progress", "Completed"].map((tab) => {
                    const isActive = filter === tab;

                    return (
                      <Btn
                        key={tab}
                        type="button"
                        onClick={() => setFilter(tab)}
                        variant="ghost"
                        className={`rounded-none border-b-2 px-0 pb-3 pt-0 text-sm font-semibold whitespace-nowrap hover:bg-transparent ${
                          isActive
                            ? "border-primary text-primary"
                            : "border-transparent text-text-muted hover:text-primary"
                        }`}
                      >
                        {tab}
                      </Btn>
                    );
                  })}
                </div>

                <div className="divide-y divide-gray-100">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.taskId}
                      className="py-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-14 h-14 rounded-2xl bg-bg text-primary flex items-center justify-center shrink-0">
                          {task.icon}
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-bold text-text truncate">
                            {task.title}
                          </h4>

                          <p className="text-sm text-text-muted flex items-center gap-1 mt-1">
                            <LocationOnIcon fontSize="small" />
                            {task.location}
                          </p>

                          <p className="text-sm text-text-muted flex items-center gap-1 mt-1">
                            <AccessTimeIcon fontSize="small" />
                            {task.time || task.createdAt}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            statusStyles[task.status]
                          }`}
                        >
                          {task.status}
                        </span>

                        <Btn
                          type="button"
                          onClick={() => openTaskDetails(task)}
                          variant="ghost"
                          className="h-10 w-10 rounded-full p-0 text-text-muted hover:bg-bg hover:text-primary"
                        >
                          <ArrowForwardIosIcon fontSize="small" />
                        </Btn>
                      </div>
                    </div>
                  ))}
                </div>

                <Btn
                  type="button"
                  onClick={() => navigate("/craftsman/tasks")}
                  variant="outline"
                  className="mt-5 w-full rounded-2xl py-3 font-bold"
                >
                  View all tasks
                </Btn>
              </div>

              {/* Back */}
              <div className="absolute inset-0 rotate-y-180 backface-hidden bg-surface rounded-3xl shadow-sm border border-gray-100 p-6 overflow-y-auto">
                {selectedTask && (
                  <TaskDetails
                    task={selectedTask}
                    onClose={closeTaskDetails}
                    onAction={handleTaskAction}
                    actionLoading={actionLoading}
                    scheduledDate={scheduledDate}
                    onScheduledDateChange={setScheduledDate}
                    onComplete={handleCompleteTask}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <aside className="xl:col-span-1 xl:mt-12">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 min-h-[620px]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-text">Reviews</h3>
                <p className="mt-1 text-sm text-text-muted">
                  Recent feedback from customers
                </p>
              </div>

              <div className="rounded-2xl bg-yellow-50 px-4 py-2 text-yellow-700">
                <p className="text-lg font-extrabold">
                  {reviewStats.averageRating || 0}
                </p>
                <p className="text-xs font-bold">Rating</p>
              </div>
            </div>

            {reviewsLoading ? (
              <p className="text-sm text-text-muted">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-bg p-6 text-center">
                <p className="font-bold text-text">No reviews yet</p>
                <p className="mt-2 text-sm text-text-muted">
                  Customer reviews will appear here after they review your
                  completed tasks.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.slice(0, 3).map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-gray-100 bg-bg p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="font-bold text-text">
                        {review.user?.name || "Customer"}
                      </p>

                      <p className="text-sm font-extrabold text-yellow-600">
                        {"★".repeat(review.rating || 0)}
                        <span className="text-gray-300">
                          {"★".repeat(5 - (review.rating || 0))}
                        </span>
                      </p>
                    </div>

                    {review.task?.title && (
                      <p className="mb-2 text-xs font-semibold text-primary">
                        {review.task.title}
                      </p>
                    )}

                    <p className="text-sm leading-6 text-text-muted">
                      {review.comment || "No comment provided."}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <Btn
              type="button"
              onClick={() => navigate("/craftsman/reviews")}
              variant="outline"
              className="mt-5 w-full rounded-2xl py-3 font-bold"
            >
              View all reviews
            </Btn>
          </div>
        </aside>
      </div>
    </section>
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
