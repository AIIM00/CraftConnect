import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedIcon from "@mui/icons-material/Verified";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
const statusStyles = {
  PENDING: "bg-orange-100 text-orange-700",
  WAITING: "bg-yellow-100 text-yellow-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminCustomerProfile() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = React.useContext(AppContext);

  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [customer, setCustomer] = React.useState(null);

  const fetchCustomerProfile = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/admin/customers/insights`,
      );

      if (!data.success) {
        toast.error(data.message || "Failed to load customer profile");
        return;
      }

      const foundCustomer = data.allCustomers?.find(
        (item) => item.id === customerId,
      );

      if (!foundCustomer) {
        toast.error("Customer not found");
        navigate("/admin/customers");
        return;
      }

      setCustomer(foundCustomer);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to load customer profile",
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomerProfile();
  }, [backendUrl, customerId]);

  const deleteCustomer = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const { data } = await axios.delete(
        `${backendUrl}/api/admin/delete/${customerId}`,
      );

      toast.success(data.message || "Customer deleted successfully");
      navigate("/admin/customers");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete customer");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <p className="text-text-muted">Loading customer profile...</p>;
  }

  if (!customer) {
    return null;
  }

  const latestTask = customer.latestTask;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <Link
            to="/admin/customers"
            className="inline-flex items-center gap-2 text-primary font-bold hover:underline mb-4"
          >
            <ArrowBackIcon fontSize="small" />
            Back to customers
          </Link>

          <p className="text-sm font-semibold text-primary-light mb-2">
            Customer Profile
          </p>

          <h1 className="text-3xl font-extrabold text-primary">
            {customer.name}
          </h1>

          <p className="text-text-muted mt-2">
            View customer contact details, location, order activity, and current
            service status.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCustomerProfile}
          className="w-fit inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary-light transition"
        >
          <RefreshIcon fontSize="small" />
          Refresh
        </button>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={<AssignmentIcon />}
          label="Total Tasks"
          value={customer.totalTasks}
          note="All ordered tasks"
          color="bg-blue-50 text-blue-600"
        />

        <StatCard
          icon={<PendingActionsIcon />}
          label="Pending"
          value={customer.pendingTasksCount}
          note="Pending or waiting tasks"
          color="bg-orange-50 text-orange-600"
        />

        <StatCard
          icon={<BuildCircleIcon />}
          label="In Progress"
          value={customer.inProgressTasksCount}
          note="Active service tasks"
          color="bg-cyan-50 text-cyan-600"
        />

        <StatCard
          icon={<CheckCircleIcon />}
          label="Completed"
          value={customer.completedTasksCount}
          note="Completed service tasks"
          color="bg-green-50 text-green-600"
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Panel title="Customer Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoBlock label="Name">
                <span className="inline-flex items-center gap-2">
                  <PeopleAltIcon fontSize="small" className="text-primary" />
                  {customer.name}
                </span>
              </InfoBlock>

              <InfoBlock label="Verification">
                {customer.isAccountVerified ? (
                  <span className="inline-flex items-center gap-2 text-green-700 font-bold">
                    <VerifiedIcon fontSize="small" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-orange-700 font-bold">
                    <ErrorOutlineOutlinedIcon fontSize="small" />
                    Not verified
                  </span>
                )}
              </InfoBlock>

              <InfoBlock label="Email">
                <span className="inline-flex items-center gap-2">
                  <EmailIcon fontSize="small" className="text-primary" />
                  {customer.email}
                </span>
              </InfoBlock>

              <InfoBlock label="Phone">
                <span className="inline-flex items-center gap-2">
                  <PhoneIcon fontSize="small" className="text-primary" />
                  {customer.phoneNumber || "No phone number"}
                </span>
              </InfoBlock>

              <InfoBlock label="City">
                <span className="inline-flex items-center gap-2">
                  <LocationOnIcon fontSize="small" className="text-primary" />
                  {customer.location?.city || "Unknown city"}
                </span>
              </InfoBlock>

              <InfoBlock label="Address">
                {[customer.location?.address, customer.location?.apartment]
                  .filter(Boolean)
                  .join(", ") || "No address saved"}
              </InfoBlock>
            </div>
          </Panel>

          <Panel title="Latest Task">
            {!latestTask ? (
              <EmptyState message="This customer has not ordered any task yet." />
            ) : (
              <TaskCard task={latestTask} />
            )}
          </Panel>

          <Panel title="Customer Timeline">
            <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-100">
              <p className="text-sm font-bold text-yellow-800">
                Recommended backend improvement
              </p>
              <p className="text-sm text-yellow-700 mt-2">
                The current insights endpoint returns only the latest task in
                the customer list. Later, return full customer task history for
                this page so the admin can see every ordered task.
              </p>
            </div>
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="Contact Customer">
            <div className="space-y-3">
              {customer.phoneNumber && (
                <a
                  href={`tel:${customer.phoneNumber}`}
                  className="block text-center py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary-light transition"
                >
                  Call Customer
                </a>
              )}

              <a
                href={`mailto:${customer.email}`}
                className="block text-center py-3 rounded-2xl bg-bg text-primary font-bold hover:bg-primary hover:text-white transition"
              >
                Email Customer
              </a>
            </div>
          </Panel>

          <Panel title="Admin Actions">
            <button
              type="button"
              disabled={actionLoading}
              onClick={deleteCustomer}
              className="w-full py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
              {actionLoading ? "Deleting..." : "Delete Customer"}
            </button>

            <p className="text-xs text-text-muted mt-3 leading-5">
              Delete only if this account was created by mistake or violates
              platform rules.
            </p>
          </Panel>

          <Panel title="Service Check">
            {customer.inProgressTasksCount > 0 ? (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                <p className="text-sm font-bold text-blue-800">
                  Customer has an active task
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  Contact the customer to check if the craftsman arrived on
                  time, communicated well, and the service is going smoothly.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-bg">
                <p className="text-sm font-bold text-text">
                  No active task right now
                </p>
                <p className="text-sm text-text-muted mt-2">
                  This customer currently has no in-progress service.
                </p>
              </div>
            )}
          </Panel>

          <Panel title="Internal Notes">
            <div className="p-4 rounded-2xl bg-bg">
              <p className="text-sm font-bold text-text">
                Future feature suggestion
              </p>
              <p className="text-sm text-text-muted mt-2">
                Add admin-only notes here so the team can record complaints,
                follow-up calls, or special customer cases.
              </p>
            </div>
          </Panel>
        </aside>
      </section>
    </div>
  );
}

function TaskCard({ task }) {
  const status = task.status || "UNKNOWN";

  return (
    <div className="p-5 rounded-2xl bg-bg border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-text">
            {task.title || "Service task"}
          </h3>

          <p className="text-sm text-text-muted mt-2">
            {task.description || "No description provided."}
          </p>

          <div className="mt-4 space-y-2 text-sm text-text-muted">
            <p>
              Service:{" "}
              <span className="font-semibold text-text">
                {task.service?.name || task.category?.name || "N/A"}
              </span>
            </p>

            <p>
              Location:{" "}
              <span className="font-semibold text-text">
                {task.location || "No location"}
              </span>
            </p>

            <p>
              Craftsman:{" "}
              <span className="font-semibold text-text">
                {task.craftsman?.user?.name || "Not assigned"}
              </span>
            </p>

            <p>
              Created:{" "}
              <span className="font-semibold text-text">
                {task.createdAt
                  ? new Date(task.createdAt).toLocaleString()
                  : "N/A"}
              </span>
            </p>

            <p>
              Scheduled:{" "}
              <span className="font-semibold text-text">
                {task.scheduledDate
                  ? new Date(task.scheduledDate).toLocaleString()
                  : "Not scheduled"}
              </span>
            </p>

            <p>
              Completed:{" "}
              <span className="font-semibold text-text">
                {task.completedAt
                  ? new Date(task.completedAt).toLocaleString()
                  : "Not completed"}
              </span>
            </p>
          </div>
        </div>

        <span
          className={`w-fit text-xs font-bold px-3 py-1 rounded-full ${
            statusStyles[status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, note, color }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-muted">{label}</p>
        <p className="text-2xl font-extrabold text-text mt-1">{value || 0}</p>
        <p className="text-xs text-text-muted mt-1">{note}</p>
      </div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-extrabold text-text mb-5">{title}</h2>
      {children}
    </div>
  );
}

function InfoBlock({ label, children }) {
  return (
    <div className="p-4 rounded-2xl bg-bg">
      <p className="text-xs font-bold text-text-muted uppercase mb-2">
        {label}
      </p>
      <div className="text-sm font-semibold text-text">{children}</div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="py-12 text-center rounded-2xl bg-bg">
      <p className="font-bold text-text">{message}</p>
    </div>
  );
}
