import * as React from "react";
import { useNavigate, Link } from "react-router-dom";

import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

//Icons
import AssignmentIcon from "@mui/icons-material/Assignment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BuildIcon from "@mui/icons-material/Build";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import BoltIcon from "@mui/icons-material/Bolt";
import WaterDropIcon from "@mui/icons-material/WaterDrop";

const statusStyles = {
  PENDING: "bg-orange-100 text-orange-600",
  IN_PROGRESS: "bg-blue-100 text-blue-600",
  COMPLETED: "bg-green-100 text-green-600",
};
export default function Dashboard() {
  const navigate = useNavigate();
  const { backendUrl } = React.useContext(AppContext);
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

  const openTaskDetails = (task) => {
    setSelectedTask(task);
    setBack(true);
  };

  const closeTaskDetails = () => {
    setBack(false);
    setSelectedTask(null);
  };

  const handleTaskAction = async (taskId, action) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.patch(
        `${backendUrl}/api/craftsman/tasks/${taskId}/respond`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(data.message);

      closeTaskDetails();
      // Re-fetch tasks after accept/reject
      await fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter(
          (task) => task.status === filter.toUpperCase().replace(" ", "_"),
        );

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/craftsman/tasks`);
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
  if (loading) {
    return <p className="text-text-muted">Loading dashboard...</p>;
  }

  return (
    <>
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

                <button className="text-primary font-bold text-sm hover:text-primary-light">
                  View all
                </button>
              </div>

              <div className="flex gap-6 border-b border-gray-100 mb-4 overflow-x-auto">
                {["All", "Pending", "In Progress", "Completed"].map((tab) => {
                  const isActive = filter === tab;

                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setFilter(tab)}
                      className={`pb-3 text-sm font-semibold whitespace-nowrap ${
                        isActive
                          ? "text-primary border-b-2 border-primary"
                          : "text-text-muted"
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              <div className="divide-y divide-gray-100">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
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

                      <button
                        type="button"
                        onClick={() => openTaskDetails(task)}
                        className="text-text-muted hover:bg-bg rounded-full p-2 transition"
                      >
                        <ArrowForwardIosIcon fontSize="small" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-5 py-3 rounded-2xl bg-bg text-primary font-bold hover:bg-primary hover:text-white transition">
                View all tasks
              </button>
            </div>

            {/* Back */}
            <div className="absolute inset-0 rotate-y-180 backface-hidden bg-surface rounded-3xl shadow-sm border border-gray-100 p-6 overflow-y-auto">
              {!selectedTask ? null : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm font-bold text-primary">
                        Task Details
                      </p>
                      <h3 className="text-xl font-extrabold text-text mt-1">
                        {selectedTask.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={closeTaskDetails}
                      className="px-4 py-2 rounded-2xl bg-bg text-text font-bold hover:bg-gray-200 transition"
                    >
                      Back
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-bg">
                      <p className="text-xs font-bold text-text-muted uppercase">
                        Status
                      </p>
                      <span
                        className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${
                          statusStyles[selectedTask.status]
                        }`}
                      >
                        {selectedTask.status}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-bg">
                      <p className="text-xs font-bold text-text-muted uppercase">
                        Description
                      </p>
                      <p className="text-sm text-text mt-2 leading-6">
                        {selectedTask.description || "No description provided."}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-bg">
                      <p className="text-xs font-bold text-text-muted uppercase">
                        Location
                      </p>
                      <p className="text-sm text-text mt-2 flex items-center gap-2">
                        <LocationOnIcon fontSize="small" />
                        {selectedTask.location}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-bg">
                      <p className="text-xs font-bold text-text-muted uppercase">
                        Customer
                      </p>

                      <div className="mt-3 space-y-1">
                        <p className="font-bold text-text">
                          {selectedTask.customer?.name || "Unknown customer"}
                        </p>

                        <p className="text-sm text-text-muted">
                          {selectedTask.customer?.email || "No email available"}
                        </p>

                        <p className="text-sm text-text-muted">
                          {selectedTask.customer?.phoneNumber ||
                            "No phone number"}
                        </p>
                      </div>
                    </div>

                    {selectedTask.status === "PENDING" && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <a
                          href={`tel:${selectedTask.customer?.phoneNumber || ""}`}
                          className="text-center py-3 rounded-2xl bg-bg text-primary font-bold hover:bg-primary hover:text-white transition"
                        >
                          Call
                        </a>

                        <button
                          type="button"
                          onClick={() =>
                            handleTaskAction(selectedTask.taskId, "ACCEPT")
                          }
                          className="py-3 rounded-2xl bg-green-600 text-white font-bold hover:bg-green-700 transition"
                        >
                          Accept
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleTaskAction(selectedTask.taskId, "REJECT")
                          }
                          className="py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {selectedTask.status === "IN_PROGRESS" && (
                      <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-100">
                        <p className="text-sm font-bold text-yellow-700">
                          This task is currently in progress.
                        </p>
                        <p className="text-sm text-yellow-700 mt-1">
                          You can add a completion button here later.
                        </p>
                      </div>
                    )}

                    {selectedTask.status === "COMPLETED" && (
                      <>
                        <div className="p-4 rounded-2xl bg-bg">
                          <p className="text-xs font-bold text-text-muted uppercase">
                            Completion Info
                          </p>

                          <div className="mt-3 space-y-2 text-sm text-text">
                            <p>
                              <span className="font-bold">Completed:</span>{" "}
                              {selectedTask.completedAt ||
                                selectedTask.createdAt ||
                                "N/A"}
                            </p>

                            <p>
                              <span className="font-bold">
                                Completion Days:
                              </span>{" "}
                              {selectedTask.completionDays || "N/A"}
                            </p>

                            <p>
                              <span className="font-bold">Notes:</span>{" "}
                              {selectedTask.completionNotes ||
                                "No notes provided."}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-bg">
                          <p className="text-xs font-bold text-text-muted uppercase">
                            Customer Review
                          </p>

                          {selectedTask.review ? (
                            <div className="mt-3">
                              <p className="font-bold text-text">
                                Rating: {selectedTask.review.rating}/5
                              </p>

                              <p className="text-sm text-text-muted mt-1">
                                {selectedTask.review.comment ||
                                  "No comment provided."}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-text-muted mt-2">
                              No review yet.
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </>
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
