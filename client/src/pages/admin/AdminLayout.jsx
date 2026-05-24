import * as React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

//MUI Components
import Box from "@mui/material/Box";
//MUI Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import RateReviewIcon from "@mui/icons-material/RateReview";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
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
    exact: true,
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
      await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true },
      );

      if (setIsLoggedIn) setIsLoggedIn(false);
      if (setUserData) setUserData(null);

      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background-dark bg-hero-gradient text-text">
      <div className="pointer-events-none fixed -left-28 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none fixed -right-28 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col overflow-hidden border-r border-border-soft bg-primary-gradient text-white shadow-glass transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-5 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Box
                onClick={() => navigate("/admin/dashboard")}
                className="group flex cursor-pointer items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-card-gradient shadow-soft">
                  <img
                    src={assets.logo}
                    alt="CraftConnect"
                    className="h-8 w-8 object-contain"
                  />
                </div>

                <div className="hidden leading-tight sm:block">
                  <h1 className="font-heading text-xl font-extrabold text-white">
                    Craft
                    <span className="text-secondary">Connect</span>
                  </h1>

                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
                    Craftsman Portal
                  </p>
                </div>
              </Box>

              <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                Admin Panel
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition hover:bg-danger lg:hidden"
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-white text-primary shadow-card"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p className="truncate font-bold text-white">
              {userData?.name || "Admin User"}
            </p>

            <p className="mt-1 truncate text-[10px] text-white/60">
              {userData?.email || "No email"}
            </p>

            <p className="mt-3 w-fit rounded-full bg-secondary/20 px-3 py-1 text-[10px] font-bold text-secondary">
              {userData?.role || "ADMIN"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-xs font-bold text-white transition hover:bg-danger"
          >
            <PowerSettingsNewIcon fontSize="small" />
            Logout
          </button>
        </div>
      </aside>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border-soft bg-white/70 px-4 py-4 shadow-soft backdrop-blur-xl sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border-soft bg-background text-primary shadow-soft lg:hidden"
              >
                <MenuIcon />
              </button>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">
                  Admin Workspace
                </p>

                <h2 className="truncate font-heading text-md font-bold text-primary">
                  Welcome, {userData?.name || "Admin"}
                </h2>
              </div>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right">
                <p className="text-sm font-bold text-text">
                  {userData?.name || "Admin"}
                </p>

                <p className="text-xs font-semibold text-text-muted">
                  {userData?.role || "ADMIN"}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-gradient text-xl font-bold text-white shadow-card">
                {(userData?.name || "A").charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
