import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../../context/AppContext";

// Components
import TaskDetails from "../../components/TasksDetails";
import Btn from "../../components/Btn";

// MUI Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HandymanIcon from "@mui/icons-material/Handyman";

const tabs = ["All", "Pending", "In Progress", "Completed"];

export default function Tasks() {
  const { backendUrl, statusStyles } = React.useContext(AppContext);

  const [tasks, setTasks] = React.useState([]);
  const [counts, setCounts] = React.useState({
    all: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  const [filter, setFilter] = React.useState("All");
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [scheduledDate, setScheduledDate] = React.useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${backendUrl}/api/craftsman/tasks`);

      if (data.success) {
        setTasks(data.tasks.all || []);
        setCounts(data.counts || {});
      } else {
        toast.error(data.message || "Failed to load tasks");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTasks();
  }, [backendUrl]);

  const handleTaskAction = async (taskId, action, selectedScheduledDate) => {
    try {
      if (action === "ACCEPT" && !selectedScheduledDate) {
        toast.error(
          "Please choose a scheduled date and time before accepting.",
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
      );

      toast.success(data.message || "Task updated successfully");

      setSelectedTask(null);
      setScheduledDate("");

      await fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      setActionLoading(true);

      const { data } = await axios.patch(
        `${backendUrl}/api/craftsman/tasks/${taskId}/complete`,
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
              <AssignmentIcon />
            </div>

            <h1 className="font-heading text-2xl font-bold text-primary">
              Loading Tasks
            </h1>

            <p className="mt-2 text-sm text-text-muted">
              Please wait while your tasks are being loaded.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-container">
        {/* HERO */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-border-soft bg-primary-gradient p-6 text-white shadow-card sm:p-8">
          <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
            Craftsman Workspace
          </p>

          <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
            My Tasks
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            View assigned tasks, accept new jobs, schedule visits, and track
            completed work.
          </p>
        </div>

        {/* STATS */}
        <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MiniStat
            icon={<AssignmentIcon />}
            label="All Tasks"
            value={counts.all || 0}
            color="bg-primary/10 text-primary"
          />

          <MiniStat
            icon={<AccessTimeIcon />}
            label="Pending"
            value={counts.pending || 0}
            color="bg-secondary/10 text-secondary"
          />

          <MiniStat
            icon={<HandymanIcon />}
            label="In Progress"
            value={counts.inProgress || 0}
            color="bg-info/10 text-info"
          />

          <MiniStat
            icon={<CheckCircleIcon />}
            label="Completed"
            value={counts.completed || 0}
            color="bg-success/10 text-success"
          />
        </section>

        {/* CONTENT */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* TASKS */}
          <div className="xl:col-span-2 rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-card sm:p-6">
            {/* FILTERS */}
            <div className="mb-5 flex gap-3 overflow-x-auto border-b border-border-soft pb-3">
              {tabs.map((tab) => {
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
              })}
            </div>

            {/* EMPTY */}
            {filteredTasks.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border-soft bg-background p-10 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
                  <AssignmentIcon />
                </div>

                <h3 className="font-heading text-2xl font-bold text-primary">
                  No tasks found
                </h3>

                <p className="mt-2 text-sm leading-7 text-text-muted">
                  There are no {filter.toLowerCase()} tasks right now.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <button
                    key={task.taskId}
                    type="button"
                    onClick={() => setSelectedTask(task)}
                    className="group w-full rounded-3xl border border-border-soft bg-background p-4 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-background-light hover:shadow-card"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
                          <AssignmentIcon />
                        </div>

                        <div className="min-w-0">
                          <h4 className="truncate font-bold text-text">
                            {task.title}
                          </h4>

                          <p className="mt-1 text-sm text-text-muted">
                            {task.service?.name || task.category?.name}
                          </p>

                          <p className="mt-2 flex items-center gap-1 truncate text-sm text-text-muted">
                            <LocationOnIcon fontSize="small" />
                            {task.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            statusStyles[task.status] ||
                            "bg-background-light text-text-muted"
                          }`}
                        >
                          {task.status}
                        </span>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-text-muted transition group-hover:bg-primary/10 group-hover:text-primary">
                          <ArrowForwardIosIcon fontSize="small" />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <aside className="rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-card sm:p-6">
            {!selectedTask ? (
              <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
                  <AssignmentIcon />
                </div>

                <h3 className="font-heading text-2xl font-bold text-primary">
                  Select a task
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-7 text-text-muted">
                  Click on a task to view full details, schedule appointments,
                  and manage actions.
                </p>
              </div>
            ) : (
              <TaskDetails
                task={selectedTask}
                actionLoading={actionLoading}
                scheduledDate={scheduledDate}
                onScheduledDateChange={setScheduledDate}
                onClose={() => {
                  setSelectedTask(null);
                  setScheduledDate("");
                }}
                onAction={handleTaskAction}
                onComplete={handleCompleteTask}
              />
            )}
          </aside>
        </section>
      </div>
    </section>
  );
}

function MiniStat({ icon, label, value, color }) {
  return (
    <div className="rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${color}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm font-bold text-text-muted">{label}</p>

          <p className="mt-1 text-3xl font-bold text-primary">{value}</p>
        </div>
      </div>
    </div>
  );
}
