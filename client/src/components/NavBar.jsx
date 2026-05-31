import * as React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

// MUI
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

// Components
import SideMenu from "../components/SideMenu";
import Btn from "../components/Btn";

//Services
import {
  getUnreadNotificationCount,
  getMyNotifications,
  markAllNotificationsAsRead,
} from "../services/notificationApi";

const pages = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "About Us", path: "/about" },
];

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { backendUrl, userData } = React.useContext(AppContext);

  const [openDrawer, setOpenDrawer] = React.useState(false);

  //Notifications Bell
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);

  const handleOpenNavMenu = () => setOpenDrawer(true);
  const handleCloseNavMenu = () => setOpenDrawer(false);

  const getInitial = () => {
    return userData?.name?.[0]?.toUpperCase() || "U";
  };

  const isActivePath = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  //Open Notifications
  const handleOpenNotifications = async () => {
    try {
      setShowNotifications((prev) => !prev);

      const data = await getMyNotifications(backendUrl);
      setNotifications(data);

      await markAllNotificationsAsRead(backendUrl);
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  //Refresh Notifications
  const refreshUnreadCount = async () => {
    try {
      const count = await getUnreadNotificationCount(backendUrl);
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to refresh unread count:", error);
    }
  };

  React.useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await getUnreadNotificationCount(backendUrl);
        setUnreadCount(count);
      } catch (error) {
        console.error("Failed to fetch notifications count:", error);
      }
    };
    fetchUnreadCount();
    refreshUnreadCount();

    const interval = setInterval(refreshUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [backendUrl]);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      className="
        !left-0 !top-0 !z-50
        border-b border-border-soft/60
        !bg-background/80
        !backdrop-blur-xl
        shadow-soft
      "
    >
      <Container
        maxWidth={false}
        disableGutters
        className="!w-full !max-w-none px-4 sm:px-6 lg:px-10"
      >
        <Toolbar
          disableGutters
          className="flex min-h-[76px] items-center justify-between gap-4"
        >
          {/* Left */}
          <Box className="flex items-center gap-3">
            {/* Mobile menu */}
            <Box className="flex md:hidden">
              <IconButton
                onClick={handleOpenNavMenu}
                aria-label="Open menu"
                className="
                  !h-11 !w-11
                  !rounded-xl
                  !border !border-border-soft
                  !bg-background
                  !text-primary
                  shadow-soft
                  transition
                  hover:!bg-background-light
                "
              >
                <MenuIcon />
              </IconButton>

              <SideMenu open={openDrawer} onClose={handleCloseNavMenu} />
            </Box>

            {/* Logo */}
            <Box
              onClick={() => navigate("/")}
              className="group flex cursor-pointer items-center gap-3"
            >
              <Box
                className="
                  flex h-12 w-12 items-center justify-center
                  rounded-2xl
                  bg-bg
                  shadow-card
                  transition duration-300
                  group-hover:scale-105
                "
              >
                <Box
                  component="img"
                  src={assets.logo}
                  alt="CraftConnect logo"
                  className="h-8 w-8 object-contain"
                />
              </Box>

              <Box className="leading-tight">
                <h1 className="font-heading text-xl font-extrabold tracking-wide text-primary sm:text-2xl">
                  Craft<span className="text-secondary">Connect</span>
                </h1>

                <p className="hidden text-[11px] font-medium tracking-wide text-text-muted sm:block">
                  Service Marketplace Platform
                </p>
              </Box>
            </Box>
          </Box>

          {/* Desktop Navigation */}
          <Box className="hidden flex-1 items-center justify-center gap-2 lg:flex">
            {pages.map((page) => {
              const active = isActivePath(page.path);

              return (
                <Link key={page.name} to={page.path}>
                  <button
                    className={`
                      relative overflow-hidden rounded-xl
                      px-5 py-3
                      text-sm font-semibold
                      transition duration-300
                      ${
                        active
                          ? "bg-primary-gradient text-white shadow-card"
                          : "text-text hover:bg-background-light hover:text-primary"
                      }
                    `}
                  >
                    {page.name}
                  </button>
                </Link>
              );
            })}
          </Box>

          {/* Right Side */}
          <Box className="flex shrink-0 items-center gap-2 sm:gap-3">
            {userData ? (
              <>
                <Btn
                  type="button"
                  variant="ghost"
                  onClick={handleOpenNotifications}
                  iconOnly
                  className="w-9 h-9 relative border border-border-soft bg-card-gradient text-primary hover:bg-background-light"
                >
                  <NotificationsNoneIcon fontSize="small" />

                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-secondary">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Btn>

                {/*Notifications DropDown*/}
                {showNotifications && (
                  <div className="absolute right-0 top-14 z-50 w-80 rounded-2xl border border-border-soft bg-white p-4 shadow-elevated">
                    <h3 className="mb-3 font-heading text-base font-semibold text-primary">
                      Notifications
                    </h3>

                    {notifications.length === 0 ? (
                      <p className="text-sm text-text-muted">
                        No notifications yet.
                      </p>
                    ) : (
                      <div className="max-h-80 space-y-3 overflow-y-auto">
                        {notifications.map((notification) => (
                          <button
                            key={notification.id}
                            type="button"
                            onClick={() => {
                              if (notification.targetUrl) {
                                navigate(notification.targetUrl);
                                setShowNotifications(false);
                              }
                            }}
                            className={`w-full rounded-xl border p-3 text-left transition hover:bg-background ${
                              notification.isRead
                                ? "border-border-soft bg-background-light"
                                : "border-primary/20 bg-primary/5"
                            }`}
                          >
                            <p className="mt-2 text-[11px] text-text-muted">
                              {new Date(
                                notification.createdAt,
                              ).toLocaleString()}
                            </p>

                            <p className="mt-1 text-xs text-text-muted">
                              {notification.message}
                            </p>
                            <p className="mt-2 text-[11px] text-text-muted">
                              {new Date(
                                notification.createdAt,
                              ).toLocaleString()}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <Tooltip title="My Bookings">
                  <IconButton
                    onClick={() => navigate("/bookings")}
                    aria-label="My bookings"
                    className="
                      !h-9 !w-9
                      !rounded-xl
                      !border !border-border-soft
                      !bg-background
                      !text-primary
                      shadow-soft
                      transition
                      hover:!bg-background-light
                    "
                  >
                    <EventAvailableIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Profile">
                  <IconButton
                    onClick={() => navigate("/profile")}
                    aria-label="Profile"
                    className="!p-0"
                  >
                    <Avatar
                      className="
                        !h-11 !w-11
                        !bg-primary-gradient
                        !text-white
                        !font-heading !font-bold
                        shadow-card
                      "
                    >
                      {getInitial()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Btn
                type="button"
                onClick={() => navigate("/login")}
                variant="ghost"
                className="
                  inline-flex h-11 items-center justify-center gap-2
                  rounded-xl
                  bg-primary-gradient
                  px-5
                  text-sm font-semibold text-white
                  shadow-card
                  transition duration-300
                  hover:scale-[1.02]
                  hover:shadow-elevated
                "
              >
                <span className="hidden sm:inline">Login</span>

                <ArrowForwardIcon fontSize="small" />
              </Btn>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
