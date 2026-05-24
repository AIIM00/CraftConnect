import { NavLink, Outlet, useNavigate } from "react-router-dom";

import * as React from "react";
import { AppContext } from "../../context/AppContext";

// Components
import Btn from "../../components/Btn";

// MUI Components
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";

import { assets } from "../../assets/assets";

// MUI Icons
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const navItems = [
  {
    label: "Dashboard",
    icon: <DashboardIcon fontSize="small" />,
    id: "dashboard",
    path: "/craftsman/dashboard",
  },
  {
    label: "My Tasks",
    icon: <AssignmentIcon fontSize="small" />,
    id: "my-tasks",
    path: "/craftsman/tasks",
  },
  {
    label: "Schedule",
    icon: <CalendarMonthIcon fontSize="small" />,
    id: "schedule",
    path: "/craftsman/schedule",
  },
  {
    label: "Reviews",
    icon: <StarBorderIcon fontSize="small" />,
    id: "reviews",
    path: "/craftsman/reviews",
  },
];

const NavBar = ({ open, onClose, onOpen }) => {
  const navigate = useNavigate();

  const { userData } = React.useContext(AppContext);

  const navContent = navItems.map((item) => (
    <NavLink
      key={item.id}
      to={item.path}
      onClick={onClose}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 overflow-hidden rounded-full px-5 py-3 text-sm font-bold transition-all duration-300 ${
          isActive
            ? "bg-primary-gradient text-white shadow-card"
            : "text-text-muted hover:bg-background hover:text-primary"
        }`
      }
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
          location.pathname === item.path
            ? "bg-white/15"
            : "bg-background-light group-hover:bg-primary/10"
        }`}
      >
        {item.icon}
      </span>

      <span>{item.label}</span>
    </NavLink>
  ));

  const mobileNavContent = navItems.map((item) => (
    <NavLink
      key={item.id}
      to={item.path}
      onClick={onClose}
      className={({ isActive }) =>
        `group flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300 ${
          isActive
            ? "bg-primary-gradient text-white shadow-card"
            : "border border-transparent text-text-muted hover:border-primary/10 hover:bg-background"
        }`
      }
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            location.pathname === item.path
              ? "bg-white/15"
              : "bg-background-light text-primary"
          }`}
        >
          {item.icon}
        </div>

        <span className="text-sm font-bold">{item.label}</span>
      </div>

      <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
    </NavLink>
  ));

  return (
    <>
      {/* TOP NAVBAR */}
      <header className="sticky top-4 z-50 px-4 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-container items-center justify-between gap-4 overflow-hidden rounded-[28px] border border-white/15 bg-white/70 px-4 py-3 shadow-[0_20px_60px_rgba(19,58,99,0.14)] backdrop-blur-xl sm:px-6">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <IconButton
              onClick={onOpen}
              className="!flex !h-11 !w-11 !items-center !justify-center !rounded-2xl !bg-background-light !text-primary lg:!hidden"
            >
              <MenuIcon />
            </IconButton>

            <Box
              onClick={() => navigate("/craftsman/dashboard")}
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
                <h1 className="font-heading text-xl font-extrabold text-primary">
                  Craft
                  <span className="bg-secondary-gradient bg-clip-text text-transparent">
                    Connect
                  </span>
                </h1>

                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
                  Craftsman Portal
                </p>
              </div>
            </Box>
          </div>

          {/* CENTER NAV */}
          <nav className="hidden items-center gap-2 rounded-full p-2 lg:flex">
            {navContent}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="group flex items-center gap-3 rounded-full border border-border-soft bg-card-gradient py-1 pl-1 pr-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <Avatar className="!h-11 !w-11 !bg-primary-gradient">
                {userData?.name?.[0]?.toUpperCase() || "U"}
              </Avatar>

              <div className="hidden text-left sm:block">
                <p className="max-w-[120px] truncate text-sm font-bold text-text">
                  {userData?.name || "User"}
                </p>

                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                  Craftsman
                </p>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        PaperProps={{
          className:
            "!w-[88%] max-w-[340px] !overflow-hidden !bg-transparent !shadow-none",
        }}
      >
        <div className="flex h-full flex-col overflow-hidden border-r border-white/10 bg-background-dark bg-hero-gradient text-white shadow-[0_25px_80px_rgba(19,58,99,0.35)]">
          {/* HEADER */}
          <div className="relative overflow-hidden border-b border-white/10 px-6 py-7">
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md">
                  <img
                    src={assets.logo}
                    alt="CraftConnect"
                    className="h-9 w-9 object-contain"
                  />
                </div>

                <h1 className="font-heading text-2xl font-extrabold text-primary">
                  Craft
                  <span className="text-secondary">Connect</span>
                </h1>

                <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                  Craftsman Portal
                </p>
              </div>

              <IconButton
                onClick={onClose}
                className="!h-11 !w-11 !rounded-2xl !border !border-border !bg-border/50 !text-white !backdrop-blur-md !transition-all hover:!bg-danger hover:!text-white hover:!shadow-lg"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          </div>

          {/* NAV */}
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <nav className="space-y-3">{mobileNavContent}</nav>
          </div>

          {/* PROFILE */}
          <div className="border-t border-white/10 p-5">
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate("/profile");
              }}
              className="flex w-full items-center gap-4 rounded-3xl border border-white/10 bg-white/10 p-4 text-left backdrop-blur-md transition hover:bg-white/15"
            >
              <Avatar className="!h-14 !w-14 !bg-primary-gradient">
                {userData?.name?.[0]?.toUpperCase() || "U"}
              </Avatar>

              <div className="min-w-0">
                <p className="truncate text-base font-bold text-primary">
                  {userData?.name || "User"}
                </p>

                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                  View profile
                </p>
              </div>
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

const CraftsmanLayout = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background-dark bg-hero-gradient text-text">
      <div className="pointer-events-none fixed -left-28 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none fixed -right-28 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <NavBar
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      />

      <main className="relative z-10 px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default CraftsmanLayout;
