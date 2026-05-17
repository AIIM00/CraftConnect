import { NavLink, Outlet, useNavigate } from "react-router-dom";

import * as React from "react";
import { AppContext } from "../../context/AppContext";

//Components
import Btn from "../../components/Btn";

//MUI Components
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";

//MUI ICONS
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import CloseIcon from "@mui/icons-material/Close";

const navItems = [
  {
    label: "Dashboard",
    icon: <DashboardIcon />,
    id: "dashboard",
    path: "/craftsman/dashboard",
  },
  {
    label: "My Tasks",
    icon: <AssignmentIcon />,
    id: "my-tasks",
    path: "/craftsman/tasks",
  },
  {
    label: "Earnings",
    icon: <AttachMoneyIcon />,
    id: "earnings",
    path: "/craftsman/earnings",
  },
  {
    label: "Schedule",
    icon: <CalendarMonthIcon />,
    id: "schedule",
    path: "/craftsman/schedule",
  },
  {
    label: "Reviews",
    icon: <StarBorderIcon />,
    id: "reviews",
    path: "/craftsman/reviews",
  },
  {
    label: "Settings",
    icon: <SettingsIcon />,
    id: "settings",
    path: "/craftsman/settings",
  },
  {
    label: "Help & Support",
    icon: <HelpIcon />,
    id: "help",
    path: "/craftsman/help",
  },
];

const SideBar = ({ open, onClose }) => {
  const {
    userData,
    availability,
    availabilityLoading,
    toggleCraftsmanAvailability,
  } = React.useContext(AppContext);

  const isAvailable =
    userData?.craftsman?.isAvailable !== undefined
      ? userData.craftsman.isAvailable
      : availability;

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-white">
      <div>
        <div className="px-8 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-primary">
              CraftConnect
            </h1>
            <p className="text-sm text-accent font-semibold">Craftsman</p>
          </div>

          <IconButton onClick={onClose} className="!flex lg:!hidden">
            <CloseIcon />
          </IconButton>
        </div>

        <nav className="px-5 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-text-muted hover:bg-bg hover:text-primary"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-6">
        <div
          className={`rounded-3xl p-5 mb-4 ${
            isAvailable ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`w-3 h-3 rounded-full ${
                isAvailable ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <p className="font-bold text-primary">
              {isAvailable ? "Online" : "Offline"}
            </p>
          </div>

          <p className="text-sm text-text-muted">
            {isAvailable
              ? "You are available for new tasks."
              : "You are currently not receiving new tasks."}
          </p>
        </div>

        <Btn
          type="button"
          onClick={toggleCraftsmanAvailability}
          disabled={availabilityLoading}
          variant={isAvailable ? "danger" : "success"}
          className="w-full rounded-2xl py-3 font-bold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <PowerSettingsNewIcon fontSize="small" />
          {availabilityLoading
            ? "Updating..."
            : isAvailable
              ? "Go Offline"
              : "Go Online"}
        </Btn>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-gray-100 flex-col justify-between">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        PaperProps={{
          className: "w-72 !rounded-r-3xl overflow-hidden",
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

const CraftsmanLayout = () => {
  const navigate = useNavigate();
  const { userData } = React.useContext(AppContext);
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const handleOpenNavMenu = () => setOpenDrawer(true);
  const handleCloseNavMenu = () => setOpenDrawer(false);
  return (
    <div className="min-h-screen bg-bg flex text-text">
      <SideBar open={openDrawer} onClose={handleCloseNavMenu} />
      {/* Main */}
      <main className="flex-1 px-4 sm:px-8 lg:px-10 py-8 overflow-y-auto">
        <div className="flex items-start justify-between mb-8">
          {/*NavBar */}
          <div className="flex flex-row">
            <Box className="flex lg:hidden">
              <IconButton onClick={handleOpenNavMenu} color="inherit">
                <MenuIcon />
              </IconButton>
            </Box>
            <Btn
              type="button"
              variant="ghost"
              className="relative h-11 w-11 rounded-full bg-white p-0 text-primary shadow-sm hover:bg-gray-50"
            >
              <NotificationsNoneIcon />

              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white">
                3
              </span>
            </Btn>
          </div>

          <Box className="flex items-center justify-end shrink-0">
            <IconButton
              onClick={() => {
                navigate("/profile");
              }}
              sx={{ p: 0 }}
            >
              <Avatar sx={{}}>{userData?.name?.[0]?.toUpperCase()}</Avatar>
            </IconButton>
          </Box>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default CraftsmanLayout;
