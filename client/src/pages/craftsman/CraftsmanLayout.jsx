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
import HelpIcon from "@mui/icons-material/Help";
import CloseIcon from "@mui/icons-material/Close";

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
        `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
          isActive
            ? "bg-primary text-white shadow-md"
            : "text-text-muted hover:bg-bg hover:text-primary"
        }`
      }
    >
      {item.icon}
      <span>{item.label}</span>
    </NavLink>
  ));

  const mobileNavContent = navItems.map((item) => (
    <NavLink
      key={item.id}
      to={item.path}
      onClick={onClose}
      className={({ isActive }) =>
        `flex w-full items-center gap-4 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
          isActive
            ? "bg-primary text-white shadow-md"
            : "text-text-muted hover:bg-bg hover:text-primary"
        }`
      }
    >
      {item.icon}
      {item.label}
    </NavLink>
  ));

  return (
    <>
      {/* top navbar */}
      <header className="sticky top-4 z-40  px-6 lg:block">
        <div className="w-full flex items-center justify-between gap-4 rounded-full border border-white/70 bg-white/80 px-6 py-3 shadow-xl shadow-slate-200/60 backdrop-blur-xl">
          <IconButton className="md:!hidden" onClick={onOpen}>
            <MenuIcon />
          </IconButton>
          {/* Logo */}

          <Box
            onClick={() => navigate("/craftsman/dashboard")}
            className="group flex shrink-0 cursor-pointer items-center gap-3"
          >
            <Box className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100">
              <Box
                component="img"
                src={assets.logo}
                alt="CraftConnect logo"
                className="h-8 w-8 object-contain"
              />
            </Box>

            <Box className="leading-tight">
              <h1 className="font-display text-xl font-extrabold tracking-wide text-primary">
                Craft<span className="text-accent">Connect</span>
              </h1>

              <p className="text-[11px] font-semibold tracking-wide text-text-muted">
                Craftsman
              </p>
            </Box>
          </Box>

          {/* Center nav */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full bg-white/70 p-1">
            {navContent}
          </nav>

          {/* Right actions */}
          <div className="flex shrink-0 items-center gap-8">
            {/*<Btn
              type="button"
              variant="ghost"
              className="relative h-11 w-11 rounded-full bg-white p-0 text-primary shadow-sm hover:bg-gray-50"
            >
              <NotificationsNoneIcon />

              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white">
                3
              </span>
            </Btn>*/}

            <IconButton
              onClick={() => navigate("/profile")}
              sx={{ p: 0 }}
              className="!shadow-sm"
            >
              <Avatar>{userData?.name?.[0]?.toUpperCase() || "U"}</Avatar>
            </IconButton>
          </div>
        </div>
      </header>
      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        PaperProps={{
          className: "w-72 !rounded-r-3xl overflow-hidden",
        }}
      >
        <div className="flex h-full flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between px-6 py-7">
              <div>
                <h1 className="text-2xl font-extrabold text-primary">
                  Craft<span className="text-accent">Connect</span>
                </h1>
                <p className="text-sm font-semibold text-accent">Craftsman</p>
              </div>

              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </div>

            <nav className="space-y-2 px-5">{mobileNavContent}</nav>
          </div>

          <div className="border-t border-gray-100 p-5">
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate("/profile");
              }}
              className="flex w-full items-center gap-3 rounded-2xl bg-bg p-3 text-left transition hover:bg-gray-100"
            >
              <Avatar>{userData?.name?.[0]?.toUpperCase() || "U"}</Avatar>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-text">
                  {userData?.name || "User"}
                </p>
                <p className="text-xs font-semibold text-text-muted">
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="min-h-screen bg-bg text-text">
      <NavBar open={open} onOpen={handleOpen} onClose={handleClose} />
      <main className=" px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default CraftsmanLayout;
