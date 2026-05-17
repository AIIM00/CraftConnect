import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

//MUI Components
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

//Icons
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { deepPurple } from "@mui/material/colors";

//Components
import Btn from "./Btn";
import SideMenu from "../components/SideMenu";

const pages = [
  { name: "Home", id: "header", path: "/" },
  { name: "Services", id: "services", path: "/services" },
  { name: "How It Works", id: "howItWorks", path: "/how-it-works" },
  { name: "About Us", id: "about", path: "/about" },
  { name: "Help", id: "help" },
];

const NavBar = () => {
  const navigate = useNavigate();
  const { userData, frontendUrl } = React.useContext(AppContext);

  const [openDrawer, setOpenDrawer] = React.useState(false);

  const handleOpenNavMenu = () => setOpenDrawer(true);
  const handleCloseNavMenu = () => setOpenDrawer(false);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      className="!bg-primary border-b border-white/10"
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters className="min-h-16 flex justify-between gap-4">
          {/* Mobile menu button */}
          <Box className="flex md:hidden">
            <IconButton onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>

            <SideMenu open={openDrawer} onClose={handleCloseNavMenu} />
          </Box>

          {/* Logo */}
          <Box
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Box
              component="img"
              src={assets.logo}
              alt="CraftConnect logo"
              className="w-12 sm:w-14 h-auto"
            />

            <Box className="leading-tight">
              <h1 className="text-base sm:text-xl font-bold text-white">
                CraftConnect
              </h1>
              <p className="hidden sm:block text-[11px] text-white/75">
                Service Marketplace Platform
              </p>
            </Box>
          </Box>

          {/* Desktop nav links */}
          <Box className="hidden md:flex flex-1 justify-center items-center gap-1">
            {pages.map((page) => (
              <Link key={page.name} to={`${frontendUrl}/${page.path}`}>
                <Button className="!text-white/90 !font-bold hover:!bg-white/10 !capitalize !px-4">
                  {page.name}
                </Button>
              </Link>
            ))}
          </Box>

          {/* Right side */}
          <Box className="flex items-center justify-end gap-2 shrink-0">
            {userData ? (
              <>
                <IconButton onClick={() => navigate("/bookings")}>
                  <EventAvailableIcon
                    fontSize="large"
                    className="text-accent-hover"
                  />
                </IconButton>
                <IconButton
                  onClick={() => {
                    navigate("/profile");
                  }}
                  sx={{ p: 0 }}
                >
                  <Avatar sx={{ bgcolor: deepPurple[500] }}>
                    {userData?.name?.[0]?.toUpperCase()}
                  </Avatar>
                </IconButton>
              </>
            ) : (
              <Btn onClick={() => navigate("/login")}>
                <span className="hidden sm:inline">Login</span>
                <ArrowForwardIcon sx={{ ml: { xs: 0, sm: 1 } }} />
              </Btn>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
