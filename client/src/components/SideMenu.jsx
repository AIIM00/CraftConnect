import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";

// MUI Components
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
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
          className: "!bg-black/40 !backdrop-blur-sm",
        },
      }}
      PaperProps={{
        className: `
          !w-[270px] sm:!w-[285px]
          !border-r !border-border-soft
          !bg-background
          !text-text
          shadow-card
        `,
      }}
    >
      <Box className="relative flex h-full flex-col overflow-hidden bg-background-dark bg-hero-gradient">
        <div className="pointer-events-none absolute -left-20 top-20 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-10 h-52 w-52 rounded-full bg-secondary/20 blur-3xl" />

        <Box className="relative z-10 border-b border-border-soft px-4 py-4">
          <Box className="flex items-start justify-between gap-3">
            <Box
              onClick={() => goTo("/")}
              className="flex cursor-pointer items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-gradient shadow-card">
                <img
                  src={assets.logo}
                  alt="CraftConnect logo"
                  className="h-8 w-8 object-contain"
                />
              </div>

              <div>
                <Typography className="!font-heading !text-lg !font-bold !text-primary">
                  Craft<span className="text-secondary">Connect</span>
                </Typography>

                <Typography className="!mt-0.5 !text-[11px] !font-medium !tracking-wide !text-text-muted">
                  Service Marketplace
                </Typography>
              </div>
            </Box>

            <IconButton
              onClick={onClose}
              aria-label="Close menu"
              className="!h-10 !w-10 !rounded-xl !border !border-border-soft !bg-background !text-primary shadow-soft transition hover:!bg-background-light"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <List className="relative z-10 flex-1 !px-3 !py-4">
          {pages.map((page) => {
            const active = isActivePath(page.path);

            return (
              <ListItem key={page.name} disablePadding className="!mb-2">
                <ListItemButton
                  onClick={() => goTo(page.path)}
                  className={`
                    group
                    !rounded-2xl
                    !px-3 !py-2.5
                    !transition-all !duration-300
                    ${
                      active
                        ? "!bg-primary-gradient !text-white shadow-card"
                        : "!border !border-transparent !text-text-muted hover:!border-border-soft hover:!bg-background hover:!text-primary"
                    }
                  `}
                >
                  <ListItemIcon
                    className={`
                      !min-w-9
                      !transition
                      ${
                        active
                          ? "!text-white"
                          : "!text-text-muted group-hover:!text-primary"
                      }
                    `}
                  >
                    {page.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={page.name}
                    primaryTypographyProps={{
                      className: "!font-semibold !text-sm",
                      fontWeight: active ? 700 : 600,
                    }}
                  />

                  {active && <ArrowForwardIcon fontSize="small" />}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box className="relative z-10 p-4">
          <div className="rounded-2xl border border-border-soft bg-card-gradient p-4 shadow-card">
            <Typography className="!font-heading !text-base !font-bold !text-primary">
              Need a trusted service?
            </Typography>

            <Typography className="!mt-2 !text-xs !leading-5 !text-text-muted">
              Explore verified craftsmen and book your next task.
            </Typography>

            <button
              type="button"
              onClick={() => goTo("/services")}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-gradient px-4 py-3 text-sm font-semibold text-white shadow-card transition duration-300 hover:scale-[1.01] hover:shadow-elevated"
            >
              Explore
              <ArrowForwardIcon fontSize="small" />
            </button>
          </div>
        </Box>
      </Box>
    </Drawer>
  );
}
