import { Link, Outlet } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

const navItems = [
  { label: "Dashboard", icon: <DashboardIcon />, id: "dashboard" },
  { label: "My Tasks", icon: <AssignmentIcon />, id: "my-tasks" },
  { label: "Earnings", icon: <AttachMoneyIcon />, id: "earnings" },
  { label: "Schedule", icon: <CalendarMonthIcon />, id: "schedule" },
  { label: "Reviews", icon: <StarBorderIcon />, id: "reviews" },
  { label: "Profile", icon: <PersonOutlineOutlinedIcon />, id: "profile" },
  {
    label: "Notifications",
    icon: <NotificationsNoneIcon />,
    id: "notifications",
  },
  { label: "Settings", icon: <SettingsIcon />, id: "settings" },
  { label: "Help & Support", icon: <HelpIcon />, id: "help" },
];

const CraftsmanLayout = () => {
  return (
    <div className="min-h-screen bg-bg flex text-text">
      {/*Sidebar*/}
      <aside className="hidden lg:flex w-72 bg-white border-r border-gray-100 flex-col justify-between">
        <div>
          <div className="px-8 py-8">
            <h1 className="text-2xl font-extrabold text-primary">
              CraftConnect
            </h1>
            <p className="text-sm text-accent font-semibold">Craftsman</p>
          </div>

          <nav className="px-5 space-y-2">
            {navItems.map((item, index) => (
              <Link key={item.name} to={`/craftsman/#${item.id}`}>
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-sm font-semibold transition ${
                    index === 0
                      ? "bg-primary text-white shadow-md"
                      : "text-text-muted hover:bg-bg hover:text-primary"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="rounded-3xl bg-green-50 p-5 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 bg-green-500 rounded-full" />
              <p className="font-bold text-primary">Online</p>
            </div>
            <p className="text-sm text-text-muted">
              You are available for new tasks.
            </p>
          </div>

          <button className="w-full py-3 rounded-2xl border border-gray-200 font-bold text-primary hover:bg-bg transition flex items-center justify-center gap-2">
            <PowerSettingsNewIcon fontSize="small" />
            Go Offline
          </button>
        </div>
      </aside>
      {/* Main */}
      <main className="flex-1 px-4 sm:px-8 lg:px-10 py-8 overflow-y-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-text">
              Welcome back, John!
            </h2>
            <p className="text-text-muted mt-2">
              Here’s what’s happening with your work today.
            </p>
          </div>

          <button className="relative w-11 h-11 bg-white rounded-full shadow-sm flex items-center justify-center text-primary">
            <NotificationsNoneIcon />
            <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default CraftsmanLayout;
