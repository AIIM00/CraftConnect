import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

//Components
import TaskDetails from "../../components/TasksDetails";
import Btn from "../../components/Btn";
// Material UI Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AssignmentIcon from "@mui/icons-material/Assignment";

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

  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter(
          (task) => task.status === filter.toUpperCase().replace(" ", "_"),
        );

  if (loading) {
    return <p className="text-text-muted">Loading tasks...</p>;
  }

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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-semibold text-primary-light mb-2">
            Craftsman Workspace
          </p>

          <h1 className="text-3xl font-extrabold text-primary">My Tasks</h1>

          <p className="text-text-muted mt-2">
            View assigned tasks, accept new jobs, and track completed work.
          </p>
        </div>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MiniStat label="All" value={counts.all || 0} />
        <MiniStat label="Pending" value={counts.pending || 0} />
        <MiniStat label="In Progress" value={counts.inProgress || 0} />
        <MiniStat label="Completed" value={counts.completed || 0} />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex gap-6 border-b border-gray-100 mb-4 overflow-x-auto">
            {tabs.map((tab) => {
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

          {filteredTasks.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-bg text-primary flex items-center justify-center mb-4">
                <AssignmentIcon />
              </div>

              <h3 className="font-bold text-primary">No tasks found</h3>

              <p className="text-sm text-text-muted mt-1">
                There are no {filter.toLowerCase()} tasks right now.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredTasks.map((task) => (
                <button
                  key={task.taskId}
                  type="button"
                  onClick={() => setSelectedTask(task)}
                  className="w-full rounded-3xl border border-gray-100 bg-white/70 px-4 py-4 text-left shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 text-primary">
                        <AssignmentIcon />
                      </div>

                      <div className="min-w-0">
                        <h4 className="truncate font-bold text-text">
                          {task.title}
                        </h4>

                        <p className="mt-1 text-sm text-text-muted">
                          {task.service?.name || task.category?.name}
                        </p>

                        <p className="mt-1 flex items-center gap-1 truncate text-sm text-text-muted">
                          <LocationOnIcon fontSize="small" />
                          {task.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          statusStyles[task.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {task.status}
                      </span>

                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bg text-text-muted transition group-hover:bg-primary/10 group-hover:text-primary">
                        <ArrowForwardIosIcon fontSize="small" />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          {!selectedTask ? (
            <div className="h-full min-h-80 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-bg text-primary flex items-center justify-center mb-4">
                <AssignmentIcon />
              </div>

              <h3 className="font-bold text-primary">Select a task</h3>

              <p className="text-sm text-text-muted mt-2">
                Click on a task to view full details and available actions.
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
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
      <p className="text-sm font-semibold text-text-muted">{label}</p>
      <p className="text-3xl font-extrabold text-primary mt-1">{value}</p>
    </div>
  );
}
