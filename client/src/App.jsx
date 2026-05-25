import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/protected/ProtectedRoute";
// Admin imports
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminCustomerProfile from "./pages/admin/AdminCustomerProfile";
import AdminCraftsmen from "./pages/admin/AdminCraftsmen";
import AdminCraftsmanProfile from "./pages/admin/AdminCraftsmanProfile";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminTasks from "./pages/admin/AdminTasks";

// Customer imports
import CustomerLayout from "./pages/customer/CustomerLayout";
import Home from "./pages/customer/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import ServicesPage from "./pages/customer/Services";
import PostTask from "./pages/customer/PostTask";
import Profile from "./pages/Profile";
import HowItWorksPage from "./pages/customer/HowItWorksPage";
import TermsPrivacy from "./pages/TermsPrivacy";
import AboutUs from "./pages/customer/AboutUs";
import Bookings from "./pages/customer/Bookings";
import BookingDetails from "./pages/customer/BookingDetails";
import LeaveReview from "./pages/customer/LeaveReview";

// Craftsman imports
import CraftsmanLayout from "./pages/craftsman/CraftsmanLayout";
import Dashboard from "./pages/craftsman/Dashboard";
import Reviews from "./pages/craftsman/Reviews";
import Schedule from "./pages/craftsman/Schedule";
import Tasks from "./pages/craftsman/Tasks";
import CraftsmanApplication from "./pages/craftsman/CraftsmanApplication";
import CraftsmanPendingApproval from "./pages/craftsman/CraftsmanPendingApproval";
import CraftsmanSuspended from "./pages/craftsman/CraftsmanSuspended";

import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div>
      <ToastContainer />

      <Routes>
        {/* Public/customer routes */}
        {/* Public/customer routes */}
        {/* Customer routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
        </Route>
        <Route
          path="/post-task"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <PostTask />
            </ProtectedRoute>
          }
        ></Route>
        <Route path="/terms-privacy" element={<TermsPrivacy />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="bookings/:taskId" element={<BookingDetails />} />
        <Route path="bookings/:taskId/review" element={<LeaveReview />} />

        {/* Auth routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER", "CRAFTSMAN", "ADMIN"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Craftsman routes */}
        <Route
          path="/craftsman"
          element={
            <ProtectedRoute
              allowedRoles={["CRAFTSMAN"]}
              allowedCraftsmanStatuses={["APPROVED"]}
              fallbackRedirect="/craftsman/pending-approval"
            >
              <CraftsmanLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route
          path="/craftsman/application"
          element={
            <ProtectedRoute
              allowedRoles={["CRAFTSMAN"]}
              allowedCraftsmanStatuses={["PENDING", "REJECTED"]}
              fallbackRedirect="/craftsman/dashboard"
            >
              <CraftsmanApplication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/craftsman/pending-approval"
          element={
            <ProtectedRoute
              allowedRoles={["CRAFTSMAN"]}
              allowedCraftsmanStatuses={["PENDING", "SUSPENDED"]}
              fallbackRedirect="/craftsman/dashboard"
            >
              <CraftsmanPendingApproval />
            </ProtectedRoute>
          }
        />
        <Route
          path="/craftsman/suspended"
          element={
            <ProtectedRoute
              allowedRoles={["CRAFTSMAN"]}
              allowedCraftsmanStatuses={["SUSPENDED"]}
              fallbackRedirect="/craftsman/dashboard"
            >
              <CraftsmanSuspended />
            </ProtectedRoute>
          }
        />

        {/* Admin routes*/}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN", "SUPERADMIN"]}
              fallbackRedirect="/"
            >
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route
            path="customers/:customerId"
            element={<AdminCustomerProfile />}
          />
          <Route path="craftsmen" element={<AdminCraftsmen />} />
          <Route
            path="craftsmen/:craftsmanId"
            element={<AdminCraftsmanProfile />}
          />
          <Route
            path="craftsmen/applications"
            element={<AdminApplications />}
          />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="tasks" element={<AdminTasks />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
