import * as React from "react";
//Components
import Btn from "../../components/Btn";

//Mui Icons
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(date) {
  return date.toISOString().split("T")[0];
}

function isSameDay(dateA, dateB) {
  return toDateKey(dateA) === toDateKey(dateB);
}

function getMonthDays(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];

  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }

  return days;
}

function getMonthRange(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return {
    startDate: toDateKey(start),
    endDate: toDateKey(end),
  };
}

export default function Schedule() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const days = getMonthDays(currentMonth);
  const today = new Date();

  React.useEffect(() => {
    fetchCalendarTasks();
  }, [currentMonth]);

  const fetchCalendarTasks = async () => {
    try {
      setLoading(true);

      const { startDate, endDate } = getMonthRange(currentMonth);

      const res = await axios.get(
        `${backendUrl}/api/craftsman/calendar-tasks`,
        {
          params: {
            startDate,
            endDate,
          },
          withCredentials: true,
        },
      );

      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error("Error fetching calendar tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedDateTasks = tasks.filter((task) => {
    const dateToUse =
      task.status === "COMPLETED" && task.completedAt
        ? task.completedAt
        : task.scheduledDate;

    if (!dateToUse) return false;

    return isSameDay(new Date(dateToUse), selectedDate);
  });

  const completedTasks = tasks.filter((task) => task.status === "COMPLETED");
  const activeTasks = tasks.filter((task) => task.status === "IN_PROGRESS");

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const monthTitle = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-semibold text-primary-light mb-2">
            Craftsman Workspace
          </p>

          <h1 className="text-3xl font-extrabold text-primary">Schedule</h1>

          <p className="text-text-muted mt-2">
            View your tasks by calendar day and track completed work.
          </p>
        </div>

        <Btn
          type="button"
          onClick={() => setSelectedDate(new Date())}
          variant="primary"
          className="rounded-2xl px-6 py-3 font-bold"
        >
          Today
        </Btn>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <StatCard
          icon={<CalendarMonthIcon />}
          label="This Month"
          value={tasks.length}
          note="Total scheduled tasks"
          color="bg-blue-50 text-blue-600"
        />

        <StatCard
          icon={<AccessTimeIcon />}
          label="Active"
          value={activeTasks.length}
          note="Upcoming or in progress"
          color="bg-orange-50 text-orange-600"
        />

        <StatCard
          icon={<CheckCircleIcon />}
          label="Completed"
          value={completedTasks.length}
          note="Finished tasks"
          color="bg-green-50 text-green-600"
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <Btn
              type="button"
              onClick={goToPreviousMonth}
              variant="ghost"
              className="h-11 w-11 rounded-2xl bg-bg p-0 hover:bg-gray-100"
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </Btn>

            <div className="text-center">
              <h2 className="text-xl font-extrabold text-text">{monthTitle}</h2>
              <p className="text-sm text-text-muted mt-1">
                Click a day to view tasks.
              </p>
            </div>

            <Btn
              type="button"
              onClick={goToNextMonth}
              variant="ghost"
              className="h-11 w-11 rounded-2xl bg-bg p-0 hover:bg-gray-100"
            >
              <ArrowForwardIosIcon fontSize="small" />
            </Btn>
          </div>

          <div className="grid grid-cols-7 gap-3 mb-3">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-extrabold text-text-muted"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} />;
              }

              const dateKey = toDateKey(day);

              const dayTasks = tasks.filter((task) => {
                const dateToUse =
                  task.status === "COMPLETED" && task.completedAt
                    ? task.completedAt
                    : task.scheduledDate;

                if (!dateToUse) return false;

                return toDateKey(new Date(dateToUse)) === dateKey;
              });

              const hasCompleted = dayTasks.some(
                (task) => task.status === "COMPLETED",
              );

              const hasActive = dayTasks.some(
                (task) => task.status === "IN_PROGRESS",
              );

              const selected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, today);
              const isPast = day < new Date(today.toDateString());

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-[105px] rounded-3xl border p-3 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 ${
                    selected
                      ? "border-primary/30 bg-primary/10 text-primary shadow-primary/10"
                      : "border-gray-100 bg-white/70 text-text hover:border-primary/20 hover:bg-primary/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-extrabold ${
                        selected ? "text-primary" : "text-primary"
                      }`}
                    >
                      {day.getDate()}
                    </span>

                    {isToday && (
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                          selected
                            ? "bg-primary/10 text-primary"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        Today
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-1">
                    {dayTasks.length > 0 ? (
                      <>
                        <p
                          className={`text-xs font-bold ${
                            selected ? "text-primary" : "text-text"
                          }`}
                        >
                          {dayTasks.length} task{dayTasks.length > 1 ? "s" : ""}
                        </p>

                        {hasActive && (
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-[10px] font-bold ${
                              selected
                                ? "bg-orange-50 text-orange-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            Active
                          </span>
                        )}

                        {hasCompleted && (
                          <span
                            className={`ml-1 inline-block rounded-full px-2 py-1 text-[10px] font-bold ${
                              selected
                                ? "bg-green-50 text-green-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            Done
                          </span>
                        )}
                      </>
                    ) : (
                      <p
                        className={`text-xs ${
                          selected ? "text-primary/70" : "text-text-muted"
                        }`}
                      >
                        {isPast ? "No completed tasks" : "No tasks"}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-extrabold text-text mb-1">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h2>

          <p className="text-sm text-text-muted mb-5">
            {selectedDateTasks.length > 0
              ? `${selectedDateTasks.length} task${
                  selectedDateTasks.length > 1 ? "s" : ""
                } for this day`
              : "No tasks for this day"}
          </p>

          {loading ? (
            <div className="rounded-3xl bg-bg p-5 text-sm text-text-muted">
              Loading tasks...
            </div>
          ) : selectedDateTasks.length === 0 ? (
            <div className="rounded-3xl bg-bg p-5">
              <p className="font-bold text-primary">No tasks</p>
              <p className="text-sm text-text-muted mt-2">
                Tasks scheduled or completed on this day will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}

function TaskCard({ task }) {
  const isCompleted = task.status === "COMPLETED";

  return (
    <div
      className={`rounded-3xl border p-5 transition ${
        isCompleted
          ? "border-green-100 bg-green-50/40"
          : "border-orange-100 bg-orange-50/40"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isCompleted
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          <AssignmentIcon />
        </div>

        <div className="flex-1">
          <h3 className="font-extrabold text-primary">{task.title}</h3>

          <p className="text-sm text-text-muted mt-1 line-clamp-2">
            {task.description}
          </p>

          <div className="mt-3 space-y-1 text-sm text-text-muted">
            <p>
              <span className="font-bold text-text">Customer:</span>{" "}
              {task.customer?.name || "Unknown"}
            </p>

            <p>
              <span className="font-bold text-text">Service:</span>{" "}
              {task.service?.name}
            </p>

            <p>
              <span className="font-bold text-text">Location:</span>{" "}
              {task.location}
            </p>

            {task.scheduledDate && (
              <p>
                <span className="font-bold text-text">Time:</span>{" "}
                {new Date(task.scheduledDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>

          <span
            className={`inline-block mt-4 text-xs font-bold px-3 py-1 rounded-full ${
              isCompleted
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {isCompleted ? "Completed" : "In Progress"}
          </span>
        </div>
      </div>
    </div>
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
