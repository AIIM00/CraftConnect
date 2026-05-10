import { Routes, Route } from "react-router-dom";

import Home from "./pages/customer/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import ServicesPage from "./pages/customer/Services";
import PostTask from "./pages/customer/PostTask";

import CraftsmanRoute from "./components/protected/CraftsmanRoute";
import CustomerOnlyRoute from "./components/protected/CustomerOnlyRoute";
import PublicHomeRoute from "./components/protected/PublicRoute";
import PendingCraftsmanRoute from "./components/protected/PendingCraftsmanRoute";
import SuspendedCraftsmanRoute from "./components/protected/SuspendedCraftsmanRoute";

import CustomerLayout from "./pages/customer/CustomerLayout";

import CraftsmanLayout from "./pages/craftsman/CraftsmanLayout";
import Dashboard from "./pages/craftsman/Dashboard";
import Earnings from "./pages/craftsman/Earnings";
import Notifications from "./pages/craftsman/Notifications";
import Profile from "./pages/craftsman/Profile";
import Reviews from "./pages/craftsman/Reviews";
import Schedule from "./pages/craftsman/Schedule";
import Settings from "./pages/craftsman/Settings";
import Tasks from "./pages/craftsman/Tasks";
import CraftsmanPendingApproval from "./pages/craftsman/CraftsmanPendingApproval";
import CraftsmanSuspended from "./pages/craftsman/CraftsmanSuspended";

import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div>
      <ToastContainer />

      <Routes>
        {/* Public/customer routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route
            index
            element={
              <PublicHomeRoute>
                <Home />
              </PublicHomeRoute>
            }
          />

          <Route path="services" element={<ServicesPage />} />
          <Route
            path="post-task"
            element={
              <CustomerOnlyRoute>
                <PostTask />
              </CustomerOnlyRoute>
            }
          />
        </Route>

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Craftsman routes */}
        <Route
          path="/craftsman"
          element={
            <CraftsmanRoute>
              <CraftsmanLayout />
            </CraftsmanRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        <Route
          path="/craftsman/pending-approval"
          element={
            <PendingCraftsmanRoute>
              <CraftsmanPendingApproval />
            </PendingCraftsmanRoute>
          }
        />
        <Route
          path="/craftsman/suspended"
          element={
            <SuspendedCraftsmanRoute>
              <CraftsmanSuspended />
            </SuspendedCraftsmanRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
