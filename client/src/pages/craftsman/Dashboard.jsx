import * as React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../../context/AppContext";
import TaskDetails from "../../components/TasksDetails";
import Btn from "../../components/Btn";

// MUI Icons
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import StarIcon from "@mui/icons-material/Star";
import HandymanIcon from "@mui/icons-material/Handyman";

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
    return (
      <section className="min-h-screen bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center">
          <div className="w-full rounded-3xl border border-border-soft bg-card-gradient p-8 text-center shadow-card">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
              <HandymanIcon />
            </div>

            <h1 className="font-heading text-2xl font-bold text-primary">
              Loading Dashboard
            </h1>

            <p className="mt-2 text-sm text-text-muted">
              Please wait while we load your tasks.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden rounded-2xl bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-container">
        <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
          <div className="overflow-hidden rounded-3xl border border-border-soft bg-primary-gradient p-6 text-white shadow-card sm:p-8">
            <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
              Craftsman Workspace
            </p>

            <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
              Welcome back, {userData?.name || "Craftsman"}!
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Manage your assigned tasks, schedule visits, complete work, and
              track customer feedback from one place.
            </p>
          </div>

          <AvailabilityCard
            isAvailable={isAvailable}
            availabilityLoading={availabilityLoading}
            onToggle={toggleCraftsmanAvailability}
          />
        </div>

        <section className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<AssignmentIcon />}
            label="All Tasks"
            value={counts.all}
            note="Total assigned work"
            color="bg-primary/10 text-primary"
          />

          <StatCard
            icon={<AccessTimeIcon />}
            label="Pending"
            value={counts.pending}
            note="Waiting for response"
            color="bg-secondary/10 text-secondary"
          />

          <StatCard
            icon={<HandymanIcon />}
            label="In Progress"
            value={counts.inProgress}
            note="Accepted tasks"
            color="bg-info/10 text-info"
          />

          <StatCard
            icon={<CheckCircleIcon />}
            label="Completed"
            value={counts.completed}
            note="Finished services"
            color="bg-success/10 text-success"
          />
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <div className="perspective">
              <div
                className={`relative w-full transition-transform duration-700 transform-style-preserve-3d ${
                  back ? "rotate-y-180" : ""
                }`}
              >
                <div className="backface-hidden rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-card sm:p-6">
                  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-primary">
                        My Tasks
                      </h2>

                      <p className="mt-1 text-sm text-text-muted">
                        Review and manage your latest assigned tasks.
                      </p>
                    </div>

                    <span className="w-fit rounded-full border border-border-soft bg-background px-4 py-2 text-sm font-bold text-primary shadow-soft">
                      {filteredTasks.length} shown
                    </span>
                  </div>

                  <div className="mb-5 flex gap-3 overflow-x-auto border-b border-border-soft pb-3">
                    {["All", "Pending", "In Progress", "Completed"].map(
                      (tab) => {
                        const isActive = filter === tab;

                        return (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setFilter(tab)}
                            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                              isActive
                                ? "bg-primary-gradient text-white shadow-card"
                                : "text-text-muted hover:bg-background hover:text-primary"
                            }`}
                          >
                            {tab}
                          </button>
                        );
                      },
                    )}
                  </div>

                  {filteredTasks.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border-soft bg-background p-8 text-center">
                      <p className="font-bold text-text">No tasks found</p>
                      <p className="mt-2 text-sm text-text-muted">
                        Tasks matching this filter will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTasks.map((task) => (
                        <TaskRow
                          key={task.taskId}
                          task={task}
                          statusStyles={statusStyles}
                          onOpen={() => openTaskDetails(task)}
                        />
                      ))}
                    </div>
                  )}

                  <Btn
                    type="button"
                    onClick={() => navigate("/craftsman/tasks")}
                    variant="outline"
                    fullWidth
                    className="mt-5 rounded-xl"
                  >
                    View all tasks
                  </Btn>
                </div>

                <div className="absolute inset-0 rotate-y-180 backface-hidden overflow-y-auto rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-card sm:p-6">
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

          <ReviewsPanel
            reviews={reviews}
            reviewsLoading={reviewsLoading}
            reviewStats={reviewStats}
            onViewAll={() => navigate("/craftsman/reviews")}
          />
        </div>
      </div>
    </section>
  );
}

function AvailabilityCard({ isAvailable, availabilityLoading, onToggle }) {
  return (
    <div className="rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-card">
      <div
        className={`rounded-2xl border p-4 ${
          isAvailable
            ? "border-success/20 bg-success/10"
            : "border-danger/20 bg-danger/10"
        }`}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full ${
                isAvailable ? "bg-success" : "bg-danger"
              }`}
            />

            <p
              className={`font-bold ${
                isAvailable ? "text-success" : "text-danger"
              }`}
            >
              {isAvailable ? "Online" : "Offline"}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              isAvailable
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger"
            }`}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>

        <p className="text-sm leading-6 text-text-muted">
          {isAvailable
            ? "You are available for new tasks."
            : "You are currently not receiving new tasks."}
        </p>
      </div>

      <Btn
        type="button"
        onClick={onToggle}
        disabled={availabilityLoading}
        variant={isAvailable ? "danger" : "success"}
        fullWidth
        className="mt-4 rounded-xl"
      >
        <PowerSettingsNewIcon fontSize="small" />
        {availabilityLoading
          ? "Updating..."
          : isAvailable
            ? "Go Offline"
            : "Go Online"}
      </Btn>
    </div>
  );
}

function TaskRow({ task, statusStyles, onOpen }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-background p-4 shadow-soft transition hover:bg-background-light">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
            <AssignmentIcon />
          </div>

          <div className="min-w-0">
            <h4 className="truncate font-bold text-text">{task.title}</h4>

            <p className="mt-2 flex items-center gap-1 text-sm text-text-muted">
              <LocationOnIcon fontSize="small" />
              <span className="truncate">{task.location}</span>
            </p>

            <p className="mt-1 flex items-center gap-1 text-sm text-text-muted">
              <AccessTimeIcon fontSize="small" />
              {task.time || task.createdAt}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              statusStyles[task.status] || "bg-background-light text-text-muted"
            }`}
          >
            {task.status}
          </span>

          <Btn
            type="button"
            onClick={onOpen}
            variant="soft"
            iconOnly
            aria-label="Open task details"
          >
            <ArrowForwardIosIcon fontSize="small" />
          </Btn>
        </div>
      </div>
    </div>
  );
}

function ReviewsPanel({ reviews, reviewsLoading, reviewStats, onViewAll }) {
  return (
    <aside className="h-fit rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-card sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-primary">
            Reviews
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Recent customer feedback
          </p>
        </div>

        <div className="rounded-2xl border border-secondary/20 bg-secondary/10 px-4 py-2 text-center text-secondary">
          <p className="text-lg font-bold">{reviewStats.averageRating || 0}</p>
          <p className="text-xs font-bold">Rating</p>
        </div>
      </div>

      {reviewsLoading ? (
        <div className="rounded-2xl border border-border-soft bg-background p-5 text-center">
          <p className="text-sm text-text-muted">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-soft bg-background p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
            <StarIcon />
          </div>

          <p className="font-bold text-text">No reviews yet</p>

          <p className="mt-2 text-sm leading-6 text-text-muted">
            Customer reviews will appear after completed tasks.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-border-soft bg-background p-4 shadow-soft"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="font-bold text-text">
                  {review.user?.name || "Customer"}
                </p>

                <p className="text-sm font-bold text-secondary">
                  {"★".repeat(review.rating || 0)}
                  <span className="text-text-muted">
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
        onClick={onViewAll}
        variant="outline"
        fullWidth
        className="mt-5 rounded-xl"
      >
        View all reviews
      </Btn>
    </aside>
  );
}

function StatCard({ icon, label, value, note, color }) {
  return (
    <div className="rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
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
