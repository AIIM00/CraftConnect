import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../../context/AppContext";

// MUI Icons
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
  PENDING: "bg-warning/10 text-warning",
  WAITING: "bg-secondary/10 text-secondary",
  IN_PROGRESS: "bg-info/10 text-info",
  COMPLETED: "bg-success/10 text-success",
  CANCELLED: "bg-danger/10 text-danger",
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
        {
          withCredentials: true,
        },
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
      "Are you sure you want to delete this customer?",
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const { data } = await axios.delete(
        `${backendUrl}/api/admin/delete/${customerId}`,
        {
          withCredentials: true,
        },
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
    return (
      <section className="min-h-screen bg-background-dark bg-hero-gradient px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-md rounded-3xl border border-border-soft bg-card-gradient p-8 text-center shadow-card">
          <PeopleAltIcon className="text-primary" />

          <p className="mt-4 text-sm font-bold text-primary">
            Loading customer profile...
          </p>
        </div>
      </section>
    );
  }

  if (!customer) return null;

  const latestTask = customer.latestTask;

  return (
    <section className="relative min-h-screen overflow-hidden bg-background-dark bg-hero-gradient px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-container">
        {/* HERO */}
        <div className="mb-6 rounded-3xl border border-border-soft bg-primary-gradient p-5 text-white shadow-card sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                to="/admin/customers"
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary backdrop-blur-sm transition hover:bg-white/15 sm:text-xs"
              >
                <ArrowBackIcon fontSize="small" />
                Back to customers
              </Link>

              <h1 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
                {customer.name}
              </h1>

              <p className="mt-3 max-w-2xl text-xs leading-6 text-white/80 sm:text-sm">
                View customer contact details, activity, latest service task,
                and account information.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchCustomerProfile}
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-secondary-gradient px-4 py-3 text-xs font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated sm:text-sm"
            >
              <RefreshIcon fontSize="small" />
              Refresh
            </button>
          </div>
        </div>

        {/* STATS */}
        <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={<AssignmentIcon />}
            label="Total Tasks"
            value={customer.totalTasks}
            note="All ordered tasks"
            color="bg-info/10 text-info"
          />

          <StatCard
            icon={<PendingActionsIcon />}
            label="Pending"
            value={customer.pendingTasksCount}
            note="Waiting tasks"
            color="bg-warning/10 text-warning"
          />

          <StatCard
            icon={<BuildCircleIcon />}
            label="In Progress"
            value={customer.inProgressTasksCount}
            note="Active services"
            color="bg-primary/10 text-primary"
          />

          <StatCard
            icon={<CheckCircleIcon />}
            label="Completed"
            value={customer.completedTasksCount}
            note="Finished tasks"
            color="bg-success/10 text-success"
          />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-6 xl:col-span-2">
            <Panel title="Customer Details">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoBlock label="Name">
                  <span className="inline-flex items-center gap-2">
                    <PeopleAltIcon fontSize="small" className="text-primary" />
                    {customer.name}
                  </span>
                </InfoBlock>

                <InfoBlock label="Verification">
                  {customer.isAccountVerified ? (
                    <span className="inline-flex items-center gap-2 font-bold text-success">
                      <VerifiedIcon fontSize="small" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 font-bold text-warning">
                      <ErrorOutlineOutlinedIcon fontSize="small" />
                      Not verified
                    </span>
                  )}
                </InfoBlock>

                <InfoBlock label="Email">
                  <span className="inline-flex items-center gap-2">
                    <EmailIcon fontSize="small" className="text-secondary" />
                    {customer.email}
                  </span>
                </InfoBlock>

                <InfoBlock label="Phone">
                  <span className="inline-flex items-center gap-2">
                    <PhoneIcon fontSize="small" className="text-secondary" />
                    {customer.phoneNumber || "No phone number"}
                  </span>
                </InfoBlock>

                <InfoBlock label="City">
                  <span className="inline-flex items-center gap-2">
                    <LocationOnIcon
                      fontSize="small"
                      className="text-secondary"
                    />
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
          </div>

          {/* RIGHT */}
          <aside className="space-y-6">
            <Panel title="Contact Customer">
              <div className="space-y-3">
                {customer.phoneNumber && (
                  <a
                    href={`tel:${customer.phoneNumber}`}
                    className="block rounded-2xl bg-primary-gradient px-4 py-3 text-center text-xs font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated sm:text-sm"
                  >
                    Call Customer
                  </a>
                )}

                <a
                  href={`mailto:${customer.email}`}
                  className="block rounded-2xl border border-border-soft bg-background px-4 py-3 text-center text-xs font-bold text-primary transition hover:bg-background-light sm:text-sm"
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
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-danger px-4 py-3 text-xs font-bold text-white transition hover:brightness-95 disabled:opacity-60 sm:text-sm"
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />

                {actionLoading ? "Deleting..." : "Delete Customer"}
              </button>

              <p className="mt-3 text-[11px] leading-5 text-text-muted sm:text-xs">
                Delete only if this account violates platform rules or was
                created incorrectly.
              </p>
            </Panel>

            <Panel title="Service Check">
              {customer.inProgressTasksCount > 0 ? (
                <div className="rounded-2xl border border-info/20 bg-info/10 p-5">
                  <p className="text-sm font-bold text-info">
                    Customer has active tasks
                  </p>

                  <p className="mt-3 text-xs leading-6 text-text-muted sm:text-sm">
                    Follow up to ensure the craftsman arrived on time and the
                    service is going smoothly.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-border-soft bg-background p-5">
                  <p className="text-sm font-bold text-text">
                    No active task right now
                  </p>

                  <p className="mt-3 text-xs leading-6 text-text-muted sm:text-sm">
                    This customer currently has no in-progress service.
                  </p>
                </div>
              )}
            </Panel>
          </aside>
        </section>
      </div>
    </section>
  );
}

function TaskCard({ task }) {
  const status = task.status || "UNKNOWN";

  return (
    <div className="rounded-3xl border border-border-soft bg-background p-5 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-text sm:text-base">
            {task.title || "Service task"}
          </h3>

          <p className="mt-2 text-xs leading-6 text-text-muted sm:text-sm">
            {task.description || "No description provided."}
          </p>

          <div className="mt-4 space-y-2 text-[11px] text-text-muted sm:text-xs">
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
          </div>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-[10px] font-bold ${
            statusStyles[status] || "bg-background-light text-text-muted"
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
    <div className="rounded-2xl border border-border-soft bg-card-gradient p-3 shadow-soft transition hover:-translate-y-1 hover:shadow-card sm:p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm ${color} sm:h-12 sm:w-12`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.08em] text-text-muted sm:text-[11px]">
            {label}
          </p>

          <p className="mt-0.5 truncate text-lg font-extrabold text-primary sm:text-xl">
            {value || 0}
          </p>

          <p className="hidden text-[10px] text-text-muted sm:block">{note}</p>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-card sm:p-6">
      <h2 className="mb-5 font-heading text-lg font-bold text-primary sm:text-xl">
        {title}
      </h2>

      {children}
    </div>
  );
}

function InfoBlock({ label, children }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-background p-4 shadow-soft">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-text-muted sm:text-[11px]">
        {label}
      </p>

      <div className="text-xs font-semibold text-text sm:text-sm">
        {children}
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-border-soft bg-background p-10 text-center">
      <p className="text-sm font-bold text-text">{message}</p>
    </div>
  );
}
