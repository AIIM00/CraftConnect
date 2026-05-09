import * as React from "react";
import { useNavigate, Link } from "react-router-dom";

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

const tasks = [
  {
    id: 1,
    title: "Fix leaking kitchen sink",
    location: "Achrafieh, Beirut",
    time: "Today, 10:00 AM",
    status: "PENDING",
    icon: <BuildIcon />,
  },
  {
    id: 2,
    title: "Electrical outlet not working",
    location: "Hamra, Beirut",
    time: "Today, 1:30 PM",
    status: "IN_PROGRESS",
    icon: <BoltIcon />,
  },
  {
    id: 3,
    title: "Water heater not heating",
    location: "Jnah, Beirut",
    time: "Tomorrow, 2:00 PM",
    status: "COMPLETED",
    icon: <WaterDropIcon />,
  },
];

const statusStyles = {
  PENDING: "bg-orange-100 text-orange-600",
  IN_PROGRESS: "bg-blue-100 text-blue-600",
  COMPLETED: "bg-green-100 text-green-600",
};

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <StatCard
          icon={<AssignmentIcon />}
          label="Today’s Tasks"
          value="4"
          note="2 pending · 2 in progress"
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={<CheckCircleIcon />}
          label="Completed This Week"
          value="12"
          note="+20% from last week"
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon={<AttachMoneyIcon />}
          label="Earnings This Week"
          value="$320"
          note="+15% from last week"
          color="bg-orange-50 text-orange-600"
        />
        <StatCard
          icon={<StarBorderIcon />}
          label="Average Rating"
          value="4.8"
          note="★★★★★"
          color="bg-indigo-50 text-indigo-600"
        />
      </section>

      {/* Content */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* My Tasks */}
        <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-extrabold text-text">My Tasks</h3>
            <button className="text-primary font-bold text-sm hover:text-primary-light">
              View all
            </button>
          </div>

          <div className="flex gap-6 border-b border-gray-100 mb-4">
            {["All", "Pending", "In Progress", "Completed"].map((tab, i) => (
              <button
                key={tab}
                className={`pb-3 text-sm font-semibold ${
                  i === 0
                    ? "text-primary border-b-2 border-primary"
                    : "text-text-muted"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="divide-y divide-gray-100">
            {tasks.map((task) => (
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
                      {task.time}
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

                  <ArrowForwardIosIcon
                    fontSize="small"
                    className="text-text-muted"
                  />
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-5 py-3 rounded-2xl bg-bg text-primary font-bold hover:bg-primary hover:text-white transition">
            View all tasks
          </button>
        </div>

        {/* Next Task */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-extrabold text-text">Next Task</h3>
            <p className="text-sm font-bold text-blue-600">In 45 min</p>
          </div>

          <div className="h-52 bg-bg rounded-2xl mb-5 flex items-center justify-center text-text-muted">
            Map Preview
          </div>

          <h4 className="text-lg font-extrabold text-text">
            Fix leaking kitchen sink
          </h4>

          <p className="text-sm text-text-muted flex items-center gap-1 mt-2">
            <LocationOnIcon fontSize="small" />
            Achrafieh, Beirut
          </p>

          <p className="text-sm text-text-muted mt-3 leading-relaxed">
            The kitchen sink keeps leaking from the pipe underneath. Customer
            needs it fixed.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <div>
              <p className="text-sm text-text-muted">Customer</p>
              <p className="font-bold text-primary">Sarah M.</p>
              <p className="text-sm text-text-muted mt-1">71 234 567</p>
            </div>

            <div>
              <p className="text-sm text-text-muted">Payment</p>
              <p className="text-2xl font-extrabold text-green-600">$80</p>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Cash
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button className="py-3 rounded-2xl border border-primary text-primary font-bold hover:bg-bg transition flex items-center justify-center gap-2">
              <PhoneIcon fontSize="small" />
              Call
            </button>

            <button className="py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary-light transition flex items-center justify-center gap-2">
              <PlayArrowIcon fontSize="small" />
              Start
            </button>
          </div>
        </div>
      </section>

      {/* Bottom widgets */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between mb-4">
            <h3 className="font-extrabold text-text">Earnings Overview</h3>
            <button className="text-sm font-bold text-primary">View all</button>
          </div>

          <p className="text-3xl font-extrabold text-text">$1,240</p>
          <p className="text-sm text-text-muted mt-1">This Month</p>
          <p className="text-sm text-green-600 font-bold mt-2">
            +18% from last month
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between mb-4">
            <h3 className="font-extrabold text-text">Recent Review</h3>
            <button className="text-sm font-bold text-primary">View all</button>
          </div>

          <p className="font-bold text-primary">Sarah M.</p>
          <p className="text-orange-400 mt-1">★★★★★ 5.0</p>
          <p className="text-sm text-text-muted mt-3">
            Great work! Very professional and fixed the issue quickly.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between mb-4">
            <h3 className="font-extrabold text-text">Availability</h3>
            <button className="text-sm font-bold text-primary">
              Edit Schedule
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
              <CalendarMonthIcon />
            </div>

            <div>
              <p className="font-bold text-primary">Available Today</p>
              <p className="text-sm text-text-muted">8:00 AM - 6:00 PM</p>
            </div>
          </div>

          <button className="w-full mt-5 py-3 rounded-2xl bg-bg text-primary font-bold hover:bg-primary hover:text-white transition">
            View Full Schedule
          </button>
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
