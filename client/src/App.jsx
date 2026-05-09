import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import ServicesPage from "./pages/Services";
import PostTask from "./pages/PostTask";

import CraftsmanRoute from "./components/protected/CraftsmanRoute";

//Craftsman Pages Imports
import CraftsmanLayout from "./pages/craftsman/CraftsmanLayout";
import Dashboard from "./pages/craftsman/Dashboard";
import Earnings from "./pages/craftsman/Earnings";
import Notifications from "./pages/craftsman/Notifications";
import Profile from "./pages/craftsman/Profile";
import Reviews from "./pages/craftsman/Reviews";
import Schedule from "./pages/craftsman/Schedule";
import Settings from "./pages/craftsman/Settings";
import Tasks from "./pages/craftsman/Tasks";

import { ToastContainer } from "react-toastify";
const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/post-task" element={<PostTask />} />
        {/*Craftsman Routes*/}
        <Route
          path="/craftsman"
          element={
            <CraftsmanRoute>
              <CraftsmanLayout />
            </CraftsmanRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
