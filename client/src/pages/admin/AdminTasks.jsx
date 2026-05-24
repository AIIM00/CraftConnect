import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../../context/AppContext";
import Btn from "../../components/Btn";

// MUI Icons
import RefreshIcon from "@mui/icons-material/Refresh";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HistoryIcon from "@mui/icons-material/History";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CancelIcon from "@mui/icons-material/Cancel";

const AdminTasks = () => {
  const { backendUrl } = React.useContext(AppContext);

  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [craftsmen, setCraftsmen] = React.useState([]);
  const [selectedCraftsmanId, setSelectedCraftsmanId] = React.useState("");
  const [actionLoading, setActionLoading] = React.useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${backendUrl}/api/admin/tasks`, {
        withCredentials: true,
      });

      if (data.success) {
        setTasks(data.tasks || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchCraftsmenForTask = async (taskId) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/tasks/${taskId}/craftsmen`,
        { withCredentials: true },
      );

      if (data.success) {
        setCraftsmen(data.craftsmen || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load craftsmen");
    }
  };

  React.useEffect(() => {
    fetchTasks();
  }, [backendUrl]);

  const openTask = async (task) => {
    setSelectedTask(task);
    setSelectedCraftsmanId("");
    setCraftsmen([]);
    await fetchCraftsmenForTask(task.id);
  };

  const retryAssignment = async (taskId) => {
    try {
      setActionLoading(true);

      const { data } = await axios.patch(
        `${backendUrl}/api/admin/tasks/${taskId}/retry`,
        {},
        { withCredentials: true },
      );

      toast.success(data.message || "Assignment retried");
      await fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Retry failed");
    } finally {
      setActionLoading(false);
    }
  };

  const cancelTask = async (taskId) => {
    try {
      setActionLoading(true);

      const { data } = await axios.patch(
        `${backendUrl}/api/admin/tasks/${taskId}/cancel`,
        {},
        { withCredentials: true },
      );

      toast.success(data.message || "Task cancelled");
      setSelectedTask(null);
      await fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancel failed");
    } finally {
      setActionLoading(false);
    }
  };

  const manuallyAssignTask = async () => {
    if (!selectedTask || !selectedCraftsmanId) {
      toast.error("Please select a craftsman");
      return;
    }

    try {
      setActionLoading(true);

      const { data } = await axios.patch(
        `${backendUrl}/api/admin/tasks/${selectedTask.id}/manual-assign`,
        { craftsmanId: selectedCraftsmanId },
        { withCredentials: true },
      );

      toast.success(data.message || "Task manually assigned");
      setSelectedTask(null);
      await fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Manual assign failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-background-dark bg-hero-gradient px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-md rounded-3xl border border-border-soft bg-card-gradient p-8 text-center shadow-card">
          <AssignmentIcon className="text-primary" />

          <p className="mt-4 text-sm font-bold text-primary">
            Loading tasks...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-background-dark bg-hero-gradient px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-container">
        <div className="mb-6 rounded-3xl border border-border-soft bg-primary-gradient p-5 text-white shadow-card sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary backdrop-blur-sm sm:text-xs">
                Task Management
              </p>

              <h1 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
                Admin Tasks
              </h1>

              <p className="mt-3 max-w-3xl text-xs leading-6 text-white/80 sm:text-sm">
                Manage task assignments, unassignable requests, customers, and
                available craftsmen.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchTasks}
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-secondary-gradient px-4 py-3 text-xs font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated sm:text-sm"
            >
              <RefreshIcon fontSize="small" />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-card sm:p-6 xl:col-span-2">
            <div className="h-fit mb-2 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-lg font-bold text-primary sm:text-xl">
                  All Tasks
                </h2>

                <p className="mt-1 text-xs text-text-muted sm:text-sm">
                  Select a task to view assignment controls.
                </p>
              </div>

              <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary sm:text-xs">
                {tasks.length} tasks
              </span>
            </div>

            {tasks.length === 0 ? (
              <EmptyState message="No tasks found." />
            ) : (
              <div className="max-h-[760px] space-y-4 overflow-y-auto pr-1">
                {tasks.map((task) => (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    selected={selectedTask?.id === task.id}
                    onClick={() => openTask(task)}
                  />
                ))}
              </div>
            )}
          </div>

          <aside className="h-fit rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-card sm:p-6">
            {!selectedTask ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
                  <AssignmentIcon />
                </div>

                <h2 className="font-heading text-lg font-bold text-primary sm:text-xl">
                  Select a task
                </h2>

                <p className="mt-2 max-w-sm text-xs leading-6 text-text-muted sm:text-sm">
                  Choose a task from the list to manage assignment, retry, or
                  cancellation.
                </p>
              </div>
            ) : (
              <TaskDetailsPanel
                task={selectedTask}
                craftsmen={craftsmen}
                selectedCraftsmanId={selectedCraftsmanId}
                setSelectedCraftsmanId={setSelectedCraftsmanId}
                actionLoading={actionLoading}
                manuallyAssignTask={manuallyAssignTask}
                retryAssignment={retryAssignment}
                cancelTask={cancelTask}
              />
            )}
          </aside>
        </div>
      </div>
    </section>
  );
};

function TaskListItem({ task, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-3xl border p-4 text-left shadow-soft transition hover:-translate-y-1 hover:shadow-card ${
        selected
          ? "border-primary/30 bg-primary/10"
          : "border-border-soft bg-background hover:bg-background-light"
      }`}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-text sm:text-base">
            {task.title}
          </p>

          <p className="mt-1 text-xs text-text-muted">
            {task.category?.name || "No category"} ·{" "}
            {task.service?.name || "No service"}
          </p>

          <p className="mt-1 text-xs text-text-muted">
            Customer:{" "}
            <span className="font-semibold text-text">
              {task.customer?.name || "Unknown"}
            </span>
          </p>
        </div>

        <StatusBadge status={task.status} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 text-[11px] text-text-muted sm:grid-cols-2 sm:text-xs">
        <p>Created: {formatDate(task.createdAt)}</p>
        <p>Last attempt: {formatDate(task.lastAssignmentAttemptAt)}</p>
        <p>Unassignable: {formatDate(task.becameUnassignableAt)}</p>
        <p>Scheduled: {formatDate(task.scheduledDate)}</p>
      </div>
    </button>
  );
}

function TaskDetailsPanel({
  task,
  craftsmen,
  selectedCraftsmanId,
  setSelectedCraftsmanId,
  actionLoading,
  manuallyAssignTask,
  retryAssignment,
  cancelTask,
}) {
  return (
    <>
      <div className="mb-5">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
          <BuildCircleIcon />
        </div>

        <h2 className="font-heading text-lg font-bold text-primary sm:text-xl">
          {task.title}
        </h2>

        <p className="mt-2 text-xs leading-6 text-text-muted sm:text-sm">
          {task.description || "No description provided."}
        </p>

        <div className="mt-3">
          <StatusBadge status={task.status} />
        </div>
      </div>

      <div className="space-y-3">
        <Info icon={<AssignmentIcon />} label="Status" value={task.status} />
        <Info
          icon={<PersonIcon />}
          label="Customer"
          value={task.customer?.name}
        />
        <Info icon={<EmailIcon />} label="Email" value={task.customer?.email} />
        <Info
          icon={<PhoneIcon />}
          label="Phone"
          value={task.customer?.phoneNumber}
        />
        <Info
          icon={<LocationOnIcon />}
          label="Location"
          value={task.location}
        />
        <Info label="Created" value={formatDate(task.createdAt)} />
        <Info
          label="Last rejection / attempt"
          value={formatDate(task.lastAssignmentAttemptAt)}
        />
        <Info
          label="Became unassignable"
          value={formatDate(task.becameUnassignableAt)}
        />
      </div>

      <div className="mt-6 border-t border-border-soft pt-5">
        <p className="mb-3 text-sm font-bold text-primary">Manual Assign</p>

        <select
          value={selectedCraftsmanId}
          onChange={(event) => setSelectedCraftsmanId(event.target.value)}
          className="w-full rounded-2xl border border-border-soft bg-background px-4 py-3 text-xs text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 sm:text-sm"
        >
          <option value="">Select craftsman</option>

          {craftsmen.map((craftsman) => (
            <option key={craftsman.userId} value={craftsman.userId}>
              {craftsman.user?.name} ·{" "}
              {craftsman.isAvailable ? "Available" : "Offline"} ·{" "}
              {craftsman.status}
            </option>
          ))}
        </select>

        <Btn
          type="button"
          disabled={actionLoading}
          onClick={manuallyAssignTask}
          fullWidth
          className="mt-3 rounded-2xl py-3 text-xs sm:text-sm"
        >
          Send Assignment Request
        </Btn>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3">
        {task.status === "UNASSIGNABLE" && (
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => retryAssignment(task.id)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary-gradient px-4 py-3 text-xs font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated disabled:opacity-60 sm:text-sm"
          >
            <RestartAltIcon fontSize="small" />
            Retry Assignment
          </button>
        )}

        {!["COMPLETED", "CANCELLED"].includes(task.status) && (
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => cancelTask(task.id)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-danger px-4 py-3 text-xs font-bold text-white transition hover:brightness-95 disabled:opacity-60 sm:text-sm"
          >
            <CancelIcon fontSize="small" />
            Cancel Task
          </button>
        )}
      </div>

      <div className="mt-6 border-t border-border-soft pt-5">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
          <HistoryIcon fontSize="small" />
          Assignment History
        </p>

        {task.assignments?.length === 0 ? (
          <p className="text-xs text-text-muted sm:text-sm">
            No assignments yet.
          </p>
        ) : (
          <div className="max-h-[260px] space-y-3 overflow-y-auto pr-1">
            {task.assignments?.map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-2xl border border-border-soft bg-background p-3"
              >
                <p className="text-sm font-bold text-text">
                  {assignment.craftsman?.user?.name || "Craftsman"}
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  Status: {assignment.status}
                </p>

                <p className="text-xs text-text-muted">
                  Assigned: {formatDate(assignment.assignedAt)}
                </p>

                <p className="text-xs text-text-muted">
                  Responded: {formatDate(assignment.respondedAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-warning/10 text-warning",
    WAITING: "bg-secondary/10 text-secondary",
    IN_PROGRESS: "bg-info/10 text-info",
    COMPLETED: "bg-success/10 text-success",
    CANCELLED: "bg-danger/10 text-danger",
    UNASSIGNABLE: "bg-primary/10 text-primary",
  };

  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-[10px] font-bold sm:text-xs ${
        styles[status] || "bg-background-light text-text-muted"
      }`}
    >
      {status}
    </span>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-background p-3">
      <p className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.08em] text-text-muted">
        {icon}
        {label}
      </p>

      <p className="text-xs font-semibold text-text sm:text-sm">
        {value || "N/A"}
      </p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-border-soft bg-background p-10 text-center">
      <p className="text-sm font-bold text-text">{message}</p>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "N/A";

  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default AdminTasks;
