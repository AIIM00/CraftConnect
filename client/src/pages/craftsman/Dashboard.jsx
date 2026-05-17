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

export default function Dashboard() {
  const navigate = useNavigate();
  const { backendUrl, userData, statusStyles } = React.useContext(AppContext);

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

  React.useEffect(() => {
    fetchTasks();
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
    <>
      <div>
        <h2 className="text-3xl font-extrabold text-text">
          {`Welcome back, ${userData.name}!`}
        </h2>
        <p className="text-text-muted mt-2">
          Here’s what’s happening with your work today.
        </p>
      </div>
      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
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
          note="+20% from last week"
          color="bg-green-50 text-green-600"
        />
      </section>

      {/* Content */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* My Tasks */}
        <div className="xl:col-span-2 perspective">
          <div
            className={`relative w-full transition-transform duration-700 transform-style-preserve-3d ${
              back ? "rotate-y-180" : ""
            }`}
          >
            {/* Front */}
            <div className="xl:col-span-2 backface-hidden bg-surface rounded-3xl shadow-sm border border-gray-100 p-6">
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
      </section>
    </>
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
