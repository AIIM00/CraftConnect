import { Outlet } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

{
  /*const navItems = [
  { label: "Dashboard", icon: <DashboardIcon />, id: "dashboard" },
  { label: "My Tasks", icon: <AssignmentIcon />, id: "my-tasks" },
  { label: "Earnings", icon: <AttachMoneyIcon />, id: "earnings" },
  { label: "Schedule", icon: <CalendarMonthIcon />, id: "schedule" },
  { label: "Reviews", icon: <StarBorderIcon />, id: "reviews" },
  { label: "Profile", icon: <PersonOutlineOutlinedIcon />, id: "profile" },
  {
    label: "Notifications",
    icon: <NotificationsNoneIcon />,
    id: "notifications",
  },
  { label: "Settings", icon: <SettingsIcon />, id: "settings" },
  { label: "Help & Support", icon: <HelpIcon />, id: "help" },
];
*/
}
const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-bg flex-col text-text">
      <NavBar />

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
        <Footer />
      </main>
    </div>
  );
};

export default CustomerLayout;
