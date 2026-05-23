import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";

// MUI Components
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

// MUI Icons
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import HelpIcon from "@mui/icons-material/Help";
import InfoIcon from "@mui/icons-material/Info";
import RouteIcon from "@mui/icons-material/Route";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const pages = [
  { name: "Home", path: "/", icon: <HomeIcon /> },
  { name: "Services", path: "/services", icon: <MiscellaneousServicesIcon /> },
  { name: "How It Works", path: "/how-it-works", icon: <RouteIcon /> },
  { name: "About Us", path: "/about", icon: <InfoIcon /> },
];

export default function SideMenu({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (path) => {
    navigate(path);
    onClose();
  };

  const isActivePath = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        BackdropProps: {
          className: "!bg-primary-dark/60 !backdrop-blur-sm",
        },
      }}
      PaperProps={{
        className:
          "!w-[305px] !overflow-hidden !rounded-r-[34px] !border-r !border-white/30 !bg-white/15 !text-text-light !shadow-glass !backdrop-blur-2xl",
      }}
    >
      <Box className="relative flex h-full flex-col overflow-hidden">
        {/* Background gradient inside drawer */}
        <Box className="absolute inset-0 bg-craft-gradient opacity-90" />

        {/* Glass highlights */}
        <Box className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/30 blur-3xl" />
        <Box className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal/30 blur-3xl" />
        <Box className="pointer-events-none absolute left-10 top-1/2 h-32 w-32 rounded-full bg-sky/20 blur-2xl" />

        {/* Header */}
        <Box className="relative z-10 border-b border-white/15 bg-white/10 p-5 backdrop-blur-xl">
          <Box className="flex items-start justify-between gap-3">
            <Box
              onClick={() => goTo("/")}
              className="flex cursor-pointer items-center gap-3"
            >
              <Box className="flex h-13 w-13 items-center justify-center rounded-2xl border border-white/25 bg-white/15 shadow-sm backdrop-blur-xl">
                <img
                  src={assets.logo}
                  alt="CraftConnect logo"
                  className="h-10 w-10 object-contain"
                />
              </Box>

              <Box>
                <Typography className="!font-display !text-xl !font-extrabold !tracking-wide !text-text-light">
                  Craft<span className="text-accent">Connect</span>
                </Typography>

                <Typography className="!mt-0.5 !text-xs !font-medium !tracking-wide !text-text-light/70">
                  Service Marketplace
                </Typography>
              </Box>
            </Box>

            <IconButton
              onClick={onClose}
              aria-label="Close menu"
              className="!h-10 !w-10 !rounded-full !border !border-white/25 !bg-white/10 !text-text-light !backdrop-blur-xl hover:!bg-accent hover:!text-primary-dark"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Links */}
        <List className="relative z-10 !px-4 !py-5 flex-1">
          {pages.map((page) => {
            const active = isActivePath(page.path);

            return (
              <ListItem key={page.name} disablePadding className="!mb-2">
                <ListItemButton
                  onClick={() => goTo(page.path)}
                  className={`group !rounded-2xl !px-4 !py-3 !transition-all ${
                    active
                      ? "!bg-accent !text-primary-dark shadow-glow"
                      : "!border !border-transparent !text-text-light/80 hover:!border-white/20 hover:!bg-white/15 hover:!text-accent"
                  }`}
                >
                  <ListItemIcon
                    className={`!min-w-10 !transition ${
                      active
                        ? "!text-primary-dark"
                        : "!text-text-light/70 group-hover:!text-accent"
                    }`}
                  >
                    {page.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={page.name}
                    primaryTypographyProps={{
                      className: "!font-display",
                      fontWeight: active ? 800 : 700,
                    }}
                  />

                  {active && <ArrowForwardIcon fontSize="small" />}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider className="relative z-10 !border-white/15" />

        {/* Footer */}
        <Box className="relative z-10 p-5">
          <Box className="rounded-3xl border border-white/20 bg-white/12 p-4 shadow-soft backdrop-blur-xl">
            <Typography className="!font-display !text-sm !font-extrabold !text-text-light">
              Need a trusted service?
            </Typography>

            <Typography className="!mt-1 !text-xs !leading-5 !text-text-light/70">
              Find skilled professionals near you and book with confidence.
            </Typography>

            <button
              type="button"
              onClick={() => goTo("/services")}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 font-display text-sm font-extrabold text-primary-dark shadow-glow transition hover:-translate-y-0.5 hover:bg-accent-hover"
            >
              Explore Services
              <ArrowForwardIcon fontSize="small" />
            </button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
