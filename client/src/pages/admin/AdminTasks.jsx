import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import Btn from "../../components/Btn";

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
    return <p className="text-text-muted">Loading tasks...</p>;
  }

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-primary">Admin Tasks</h1>
          <p className="mt-2 text-text-muted">
            Manage task assignment, unassignable tasks, customers, and
            craftsmen.
          </p>
        </div>

        <Btn
          type="button"
          onClick={fetchTasks}
          className="rounded-2xl px-5 py-3"
        >
          Refresh
        </Btn>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="mb-5 text-xl font-extrabold text-text">All Tasks</h2>

          <div className="space-y-4">
            {tasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => openTask(task)}
                className={`w-full rounded-2xl border p-4 text-left transition hover:bg-bg ${
                  selectedTask?.id === task.id
                    ? "border-primary bg-bg"
                    : "border-gray-100 bg-white"
                }`}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-extrabold text-text">{task.title}</p>
                    <p className="mt-1 text-sm text-text-muted">
                      {task.category?.name} · {task.service?.name}
                    </p>
                    <p className="mt-1 text-sm text-text-muted">
                      Customer: {task.customer?.name || "Unknown"}
                    </p>
                  </div>

                  <StatusBadge status={task.status} />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-text-muted md:grid-cols-2">
                  <p>Created: {formatDate(task.createdAt)}</p>
                  <p>
                    Last attempt: {formatDate(task.lastAssignmentAttemptAt)}
                  </p>
                  <p>Unassignable: {formatDate(task.becameUnassignableAt)}</p>
                  <p>Scheduled: {formatDate(task.scheduledDate)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
          {!selectedTask ? (
            <p className="text-text-muted">Select a task to manage it.</p>
          ) : (
            <>
              <h2 className="text-xl font-extrabold text-text">
                {selectedTask.title}
              </h2>

              <p className="mt-2 text-sm text-text-muted">
                {selectedTask.description}
              </p>

              <div className="mt-5 space-y-3 text-sm">
                <Info label="Status" value={selectedTask.status} />
                <Info label="Customer" value={selectedTask.customer?.name} />
                <Info label="Email" value={selectedTask.customer?.email} />
                <Info
                  label="Phone"
                  value={selectedTask.customer?.phoneNumber}
                />
                <Info label="Location" value={selectedTask.location} />
                <Info
                  label="Created"
                  value={formatDate(selectedTask.createdAt)}
                />
                <Info
                  label="Last rejection/attempt"
                  value={formatDate(selectedTask.lastAssignmentAttemptAt)}
                />
                <Info
                  label="Became unassignable"
                  value={formatDate(selectedTask.becameUnassignableAt)}
                />
              </div>

              <div className="mt-6 border-t border-gray-100 pt-5">
                <p className="mb-2 font-bold text-text">Manual assign</p>

                <select
                  value={selectedCraftsmanId}
                  onChange={(e) => setSelectedCraftsmanId(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none"
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
                  className="mt-3 w-full rounded-2xl py-3"
                >
                  Send Assignment Request
                </Btn>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3">
                {selectedTask.status === "UNASSIGNABLE" && (
                  <Btn
                    type="button"
                    disabled={actionLoading}
                    onClick={() => retryAssignment(selectedTask.id)}
                    className="rounded-2xl py-3"
                  >
                    Retry Assignment
                  </Btn>
                )}

                {!["COMPLETED", "CANCELLED"].includes(selectedTask.status) && (
                  <Btn
                    type="button"
                    disabled={actionLoading}
                    onClick={() => cancelTask(selectedTask.id)}
                    className="rounded-2xl bg-red-600 py-3 text-white"
                  >
                    Cancel Task
                  </Btn>
                )}
              </div>

              <div className="mt-6 border-t border-gray-100 pt-5">
                <p className="mb-3 font-bold text-text">Assignment History</p>

                {selectedTask.assignments?.length === 0 ? (
                  <p className="text-sm text-text-muted">No assignments yet.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedTask.assignments?.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="rounded-2xl bg-bg p-3 text-sm"
                      >
                        <p className="font-bold text-text">
                          {assignment.craftsman?.user?.name || "Craftsman"}
                        </p>
                        <p className="text-text-muted">
                          Status: {assignment.status}
                        </p>
                        <p className="text-text-muted">
                          Assigned: {formatDate(assignment.assignedAt)}
                        </p>
                        <p className="text-text-muted">
                          Responded: {formatDate(assignment.respondedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </aside>
      </div>
    </section>
  );
};

function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-orange-100 text-orange-700",
    WAITING: "bg-yellow-100 text-yellow-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    UNASSIGNABLE: "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-xs font-extrabold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-text-muted">{label}</p>
      <p className="mt-1 font-semibold text-text">{value || "N/A"}</p>
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
