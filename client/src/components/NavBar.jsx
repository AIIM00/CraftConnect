import * as React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

// MUI Components
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";

// Icons
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonIcon from "@mui/icons-material/Person";

// Components
import SideMenu from "../components/SideMenu";

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
      position="sticky"
      elevation={0}
      className="!fixed !top-0 !left-0 !z-50 w-full !bg-[rgba(11,37,64,0.38)] !text-text-light !backdrop-blur-xl border-b border-white/10 shadow-none"
    >
      <Container
        maxWidth={false}
        disableGutters
        className="!w-full !max-w-none px-4 sm:px-8 lg:px-12"
      >
        <Toolbar
          disableGutters
          className="min-h-[74px] flex justify-between  gap-4"
        >
          {/* Mobile menu button */}
          <Box className="flex md:hidden">
            <IconButton
              onClick={handleOpenNavMenu}
              aria-label="Open menu"
              className="!text-white hover:!bg-white/10"
            >
              <MenuIcon />
            </IconButton>

            <SideMenu open={openDrawer} onClose={handleCloseNavMenu} />
          </Box>

          {/* Logo */}
          <Box
            onClick={() => navigate("/")}
            className="group flex items-center gap-3 cursor-pointer shrink-0"
          >
            <Box className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 border border-white/15 shadow-sm transition group-hover:border-accent/70 group-hover:bg-white/15">
              <Box
                component="img"
                src={assets.logo}
                alt="CraftConnect logo"
                className="h-9 w-9 object-contain"
              />
            </Box>

            <Box className="leading-tight">
              <h1 className="font-display text-lg sm:text-2xl font-extrabold tracking-wide text-text-light">
                Craft<span className="text-accent">Connect</span>
              </h1>

              <p className="hidden sm:block text-[11px] font-medium tracking-wide text-text-light/65">
                Service Marketplace Platform
              </p>
            </Box>
          </Box>

          {/* Desktop nav links */}
          <Box className="hidden md:flex flex-1 justify-center items-center gap-1  lg:gap-6">
            {pages.map((page) => {
              const active = isActivePath(page.path);

              return (
                <Link key={page.name} to={page.path}>
                  <Button
                    className={`!rounded-full !px-4 !py-2 !font-display !text-sm md:!text-lg md:!font-bold !font-bold !capitalize !transition ${
                      active
                        ? "!bg-accent !text-primary-dark shadow-glow"
                        : "!text-white hover:!bg-white/10 hover:!text-accent"
                    }`}
                  >
                    {page.name}
                  </Button>
                </Link>
              );
            })}
          </Box>

          {/* Right side */}
          <Box className="flex items-center justify-end gap-2 shrink-0">
            {userData ? (
              <>
                <Tooltip title="My Bookings">
                  <IconButton
                    onClick={() => navigate("/bookings")}
                    aria-label="My bookings"
                    className="!h-11 !w-11 !rounded-full !border !border-white/15 !bg-white/10 !text-surface transition hover:!bg-accent/60"
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
                    <Avatar className="!h-11 !w-11 !bg-accent !text-primary-dark !font-display !font-extrabold !border !border-white/20 shadow-glow">
                      {getInitial()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 font-display font-extrabold text-primary-dark shadow-glow transition hover:-translate-y-0.5 hover:bg-accent-hover"
              >
                <span className="hidden sm:inline">Login</span>
                <ArrowForwardIcon fontSize="small" />
              </button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
