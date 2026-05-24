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

// Components
import SideMenu from "../components/SideMenu";
import Btn from "../components/Btn";

const pages = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "About Us", path: "/about" },
];

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { userData } = React.useContext(AppContext);

  const [openDrawer, setOpenDrawer] = React.useState(false);

  const handleOpenNavMenu = () => setOpenDrawer(true);
  const handleCloseNavMenu = () => setOpenDrawer(false);

  const getInitial = () => {
    return userData?.name?.[0]?.toUpperCase() || "U";
  };

  const isActivePath = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

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
                <Tooltip title="My Bookings">
                  <IconButton
                    onClick={() => navigate("/bookings")}
                    aria-label="My bookings"
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
