import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";

//MUI Components
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

//MUI Icons
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import HelpIcon from "@mui/icons-material/Help";
import InfoIcon from "@mui/icons-material/Info";
import RouteIcon from "@mui/icons-material/Route";

const pages = [
  { name: "Home", path: "/", icon: <HomeIcon /> },
  { name: "Services", path: "/services", icon: <MiscellaneousServicesIcon /> },
  { name: "How It Works", path: "/how-it-works", icon: <RouteIcon /> },
  { name: "About Us", path: "/about", icon: <InfoIcon /> },
  { name: "Help", path: "/help", icon: <HelpIcon /> },
];

export default function SideMenu({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const goTo = (path) => {
    navigate(path);
    onClose();
  };
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        className:
          "!bg-primary !text-white w-[280px] rounded-r-3xl overflow-hidden",
      }}
    >
      <Box className="h-full flex flex-col">
        <Box className="p-5 bg-white/10">
          <Box className="flex items-center justify-between">
            <Box className="flex items-center gap-3">
              <img
                src={assets.logo}
                alt="CraftConnect logo"
                className="w-12 h-auto"
              />

              <Box>
                <Typography className="!font-bold !text-xl !text-primary">
                  CraftConnect
                </Typography>
                <Typography className="!text-sm !text-primary-light">
                  Service Marketplace
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose} className="!text-white">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        {/*Links*/}
        <List className="!px-3 !py-5 flex-1">
          {pages.map((page) => {
            const active = location.pathname === page.path;
            return (
              <ListItem key={page.name} disablePadding className="!mb-2">
                <ListItemButton
                  onClick={() => goTo(page.path)}
                  className={`!rounded-2xl !px-4 !py-3 transition-all ${active ? "!bg-accent-hover !text-white" : "!text-text-muted hover:!bg-accent-soft"}`}
                >
                  <ListItemIcon
                    className={`!min-w-10 ${active ? "!text-white" : "!text-primary"}`}
                  >
                    {page.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={page.name}
                    primaryTypographyProps={{ fontWeight: active ? 700 : 500 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Divider className="!border-text-muted" />
        {/* Footer */}
        <Box className="p-5">
          <Box className="rounded-2xl bg-white/10 p-4">
            <Typography className="!text-sm !font-semibold cursor-pointer">
              Need a trusted service?
            </Typography>
            <Typography className="!text-xs !text-text-muted !mt-1">
              Find skilled professionals near you.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
