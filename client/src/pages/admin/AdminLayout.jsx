import * as React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import RateReviewIcon from "@mui/icons-material/RateReview";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const adminNavItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    label: "Customers",
    path: "/admin/customers",
    icon: <PeopleAltIcon />,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    label: "Craftsmen",
    path: "/admin/craftsmen",
    icon: <EngineeringIcon />,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    label: "Applications",
    path: "/admin/craftsmen/applications",
    icon: <AssignmentTurnedInIcon />,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    label: "Tasks",
    path: "/admin/tasks",
    icon: <BuildCircleIcon />,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    label: "Reviews",
    path: "/admin/reviews",
    icon: <RateReviewIcon />,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    label: "Warnings",
    path: "/admin/warnings",
    icon: <WarningAmberIcon />,
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    label: "Invites",
    path: "/admin/invites",
    icon: <PersonAddAltIcon />,
    roles: ["SUPERADMIN"],
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: <SettingsIcon />,
    roles: ["ADMIN", "SUPERADMIN"],
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { backendUrl, userData, setIsLoggedIn, setUserData } =
    React.useContext(AppContext);

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const visibleNavItems = adminNavItems.filter((item) =>
    item.roles.includes(userData?.role),
  );

  const handleLogout = async () => {
    try {
      await axios.post(`${backendUrl}/api/auth/logout`);

      if (setIsLoggedIn) setIsLoggedIn(false);
      if (setUserData) setUserData(null);

      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-primary text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
          <div>
            <h1 className="text-2xl font-extrabold">CraftConnect</h1>
            <p className="text-xs text-white/70 mt-1">Admin Panel</p>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition ${
                  isActive
                    ? "bg-white text-primary shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="flex items-center justify-center">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/10 mb-3">
            <p className="font-bold truncate">
              {userData?.name || "Admin User"}
            </p>
            <p className="text-xs text-white/70 truncate mt-1">
              {userData?.email || "No email"}
            </p>
            <p className="text-xs font-bold text-accent-soft mt-2">
              {userData?.role || "ADMIN"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/10 text-white font-bold hover:bg-red-500 transition"
          >
            <PowerSettingsNewIcon fontSize="small" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="h-20 bg-white border-b border-gray-100 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-2xl bg-bg text-primary flex items-center justify-center"
            >
              <MenuIcon />
            </button>

            <div>
              <p className="text-xs font-bold text-primary-light uppercase">
                Admin Workspace
              </p>
              <h2 className="font-extrabold text-text">
                Welcome, {userData?.name || "Admin"}
              </h2>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-text">
                {userData?.name || "Admin"}
              </p>
              <p className="text-xs text-text-muted">
                {userData?.role || "ADMIN"}
              </p>
            </div>

            <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-extrabold">
              {(userData?.name || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
