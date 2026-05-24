import * as React from "react";
import axios from "axios";

// Components
import Btn from "../../components/Btn";

// MUI Icons
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

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
    <section className="relative min-h-screen overflow-hidden bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-container">
        {/* HERO */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-border-soft bg-primary-gradient p-6 text-white shadow-card sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                Craftsman Workspace
              </p>

              <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
                Schedule Calendar
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                View your tasks by calendar day and track completed work.
              </p>
            </div>

            <Btn
              type="button"
              onClick={() => setSelectedDate(new Date())}
              variant="secondary"
              className="rounded-2xl px-6"
            >
              Today
            </Btn>
          </div>
        </div>

        {/* STATS */}
        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={<CalendarMonthIcon />}
            label="This Month"
            value={tasks.length}
            note="Total scheduled tasks"
            color="bg-primary/10 text-primary"
          />

          <StatCard
            icon={<AccessTimeIcon />}
            label="Active"
            value={activeTasks.length}
            note="Upcoming or in progress"
            color="bg-secondary/10 text-secondary"
          />

          <StatCard
            icon={<CheckCircleIcon />}
            label="Completed"
            value={completedTasks.length}
            note="Finished tasks"
            color="bg-success/10 text-success"
          />
        </section>

        {/* CONTENT */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* CALENDAR */}
          <div className="xl:col-span-2 rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-card sm:p-6">
            {/* HEADER */}
            <div className="mb-6 flex items-center justify-between">
              <Btn
                type="button"
                onClick={goToPreviousMonth}
                variant="soft"
                iconOnly
                className="rounded-2xl"
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </Btn>

              <div className="text-center">
                <h2 className="font-heading text-2xl font-bold text-primary">
                  {monthTitle}
                </h2>

                <p className="mt-1 text-sm text-text-muted">
                  Click a day to view tasks
                </p>
              </div>

              <Btn
                type="button"
                onClick={goToNextMonth}
                variant="soft"
                iconOnly
                className="rounded-2xl"
              >
                <ArrowForwardIosIcon fontSize="small" />
              </Btn>
            </div>

            {/* WEEK DAYS */}
            <div className="mb-3 grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-[10px] font-bold uppercase tracking-[0.04em] text-text-muted sm:text-xs lg:text-sm"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* DAYS */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3">
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
                    className={`min-h-[70px] rounded-xl flex flex-col border p-2 text-center shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card sm:min-h-[95px] sm:rounded-2xl sm:p-3 lg:min-h-[115px] lg:rounded-3xl ${
                      selected
                        ? "border-primary/20 bg-primary/10"
                        : "border-border-soft bg-background hover:border-primary/20 hover:bg-background-light"
                    }`}
                  >
                    {isToday && (
                      <span className="relative bottom-2 rounded-full bg-secondary/10 px-2 py-1 text-[8px] font-bold text-secondary">
                        Today
                      </span>
                    )}

                    <span
                      className={`text-[10px] font-bold sm:text-xs ${
                        selected ? "text-primary" : "text-text"
                      }`}
                    >
                      {day.getDate()}
                    </span>

                    <div className="mt-4">
                      {dayTasks.length > 0 ? (
                        <>
                          <p
                            className={`text-xs font-bold ${
                              selected ? "text-primary" : "text-text"
                            }`}
                          >
                            {dayTasks.length} task
                            {dayTasks.length > 1 ? "s" : ""}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-1">
                            {hasActive && (
                              <span className="rounded-full bg-secondary/10 px-2 py-1 text-[10px] font-bold text-secondary">
                                Active
                              </span>
                            )}

                            {hasCompleted && (
                              <span className="rounded-full bg-success/10 px-2 py-1 text-[10px] font-bold text-success">
                                Done
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="hidden text-xs text-text-muted sm:block">
                          {isPast ? "No completed tasks" : "No tasks"}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-card sm:p-6">
            <div className="mb-5">
              <h2 className="font-heading text-2xl font-bold text-primary">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                {selectedDateTasks.length > 0
                  ? `${selectedDateTasks.length} task${
                      selectedDateTasks.length > 1 ? "s" : ""
                    } for this day`
                  : "No tasks for this day"}
              </p>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-border-soft bg-background p-5 text-sm text-text-muted">
                Loading tasks...
              </div>
            ) : selectedDateTasks.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border-soft bg-background p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
                  <EventAvailableIcon />
                </div>

                <h3 className="font-bold text-primary">No tasks</h3>

                <p className="mt-2 text-sm leading-7 text-text-muted">
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
    </section>
  );
}

function TaskCard({ task }) {
  const isCompleted = task.status === "COMPLETED";

  return (
    <div
      className={`rounded-3xl border p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card ${
        isCompleted
          ? "border-success/20 bg-success/10"
          : "border-secondary/20 bg-secondary/10"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
            isCompleted ? "bg-success text-white" : "bg-secondary text-white"
          }`}
        >
          <AssignmentIcon />
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-primary">{task.title}</h3>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-muted">
            {task.description}
          </p>

          <div className="mt-4 space-y-2 text-sm text-text-muted">
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
            className={`mt-5 inline-block rounded-full px-3 py-1 text-xs font-bold ${
              isCompleted
                ? "bg-success/10 text-success"
                : "bg-secondary/10 text-secondary"
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
