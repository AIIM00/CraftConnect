import * as React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedIcon from "@mui/icons-material/Verified";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function AdminCustomers() {
  const { backendUrl } = React.useContext(AppContext);

  const [loading, setLoading] = React.useState(true);
  const [allCustomers, setAllCustomers] = React.useState([]);
  const [topCustomers, setTopCustomers] = React.useState([]);
  const [customersByCity, setCustomersByCity] = React.useState([]);
  const [customersWithInProgressTasks, setCustomersWithInProgressTasks] =
    React.useState([]);

  const fetchCustomerInsights = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/admin/customers/insights`,
        { withCredentials: true },
      );

      if (!data.success) {
        toast.error(data.message || "Failed to load customers");
        return;
      }

      setAllCustomers(data.allCustomers || []);
      setTopCustomers(data.topCustomers || []);
      setCustomersByCity(data.customersByCity || []);
      setCustomersWithInProgressTasks(data.customersWithInProgressTasks || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomerInsights();
  }, [backendUrl]);

  if (loading) {
    return (
      <section className="min-h-screen bg-background-dark bg-hero-gradient px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-md rounded-3xl border border-border-soft bg-card-gradient p-8 text-center shadow-card">
          <PeopleAltIcon className="text-primary" />
          <p className="mt-4 text-sm font-bold text-primary">
            Loading customers...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-background-dark bg-hero-gradient px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-container">
        <div className="mb-6 rounded-3xl border border-border-soft bg-primary-gradient p-5 text-white shadow-card sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary backdrop-blur-sm sm:text-xs">
                Customer Management
              </p>

              <h1 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">
                Customers
              </h1>

              <p className="mt-3 max-w-2xl text-xs leading-6 text-white/80 sm:text-sm">
                Understand customer activity, active service experiences, and
                top customers across the platform.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchCustomerInsights}
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-secondary-gradient px-4 py-3 text-xs font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated sm:text-sm"
            >
              <RefreshIcon fontSize="small" />
              Refresh
            </button>
          </div>
        </div>

        <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
          <SummaryCard
            icon={<PeopleAltIcon />}
            label="Total Customers"
            value={allCustomers.length}
            note="Registered customer accounts"
            color="bg-primary/10 text-primary"
          />

          <SummaryCard
            icon={<LocationCityIcon />}
            label="Cities"
            value={customersByCity.length}
            note="Cities with customers"
            color="bg-info/10 text-info"
          />

          <SummaryCard
            icon={<BuildCircleIcon />}
            label="Active Customers"
            value={customersWithInProgressTasks.length}
            note="Customers with active tasks"
            color="bg-secondary/10 text-secondary"
          />
        </section>

        <SectionHeader
          title="Top Customers"
          description="Customers ranked by number of requested tasks."
        />

        {topCustomers.length === 0 ? (
          <EmptyState message="No customers found." />
        ) : (
          <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topCustomers.map((customer, index) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                badge={`#${index + 1}`}
                highlight={`${customer.totalTasks} tasks`}
              />
            ))}
          </section>
        )}

        <SectionHeader
          title="Customers by City"
          description="Cities where CraftConnect currently has customers."
        />

        {customersByCity.length === 0 ? (
          <EmptyState message="No city data found." />
        ) : (
          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {customersByCity.map((city) => (
              <CityCard key={city.city} city={city} />
            ))}
          </section>
        )}

        <SectionHeader
          title="Customers With Tasks In Progress"
          description="Customers currently receiving active services."
        />

        {customersWithInProgressTasks.length === 0 ? (
          <EmptyState message="No customers currently have in-progress tasks." />
        ) : (
          <section className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-2">
            {customersWithInProgressTasks.map((item) => (
              <ActiveCustomerCard
                key={`${item.customer.id}-${item.task.id}`}
                item={item}
              />
            ))}
          </section>
        )}

        <SectionHeader
          title="All Customers"
          description="Complete customer list."
        />

        {allCustomers.length === 0 ? (
          <EmptyState message="No customers found." />
        ) : (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {allCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                highlight={`${customer.totalTasks} tasks`}
              />
            ))}
          </section>
        )}
      </div>
    </section>
  );
}

function CustomerCard({ customer, badge, highlight }) {
  return (
    <Link
      to={`/admin/customers/${customer.id}`}
      className="block rounded-3xl border border-border-soft bg-card-gradient p-4 shadow-soft transition hover:-translate-y-1 hover:shadow-card sm:p-5"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-extrabold text-text sm:text-base">
              {customer.name}
            </h3>

            {customer.isAccountVerified ? (
              <VerifiedIcon className="text-success" fontSize="small" />
            ) : (
              <ErrorOutlineOutlinedIcon
                className="text-secondary"
                fontSize="small"
              />
            )}
          </div>

          <p className="mt-1 text-[11px] text-text-muted sm:text-xs">
            {customer.isAccountVerified ? "Verified" : "Not verified"}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {badge && (
            <span className="rounded-full bg-primary-gradient px-3 py-1 text-[10px] font-bold text-white">
              {badge}
            </span>
          )}

          <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
            {highlight}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-[11px] text-text-muted sm:text-xs">
        <p className="flex items-center gap-2">
          <EmailIcon fontSize="small" className="text-secondary" />
          <span className="truncate">{customer.email}</span>
        </p>

        <p className="flex items-center gap-2">
          <PhoneIcon fontSize="small" className="text-secondary" />
          <span>{customer.phoneNumber || "No phone number"}</span>
        </p>

        <p className="flex items-center gap-2">
          <LocationOnIcon fontSize="small" className="text-secondary" />
          <span>{customer.location?.city || "Unknown city"}</span>
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <MiniCount label="Pending" value={customer.pendingTasksCount} />
        <MiniCount label="Active" value={customer.inProgressTasksCount} />
        <MiniCount label="Done" value={customer.completedTasksCount} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border-soft pt-4">
        <p className="text-xs font-bold text-primary sm:text-sm">
          Open profile
        </p>
        <ArrowForwardIosIcon fontSize="small" className="text-primary" />
      </div>
    </Link>
  );
}

function CityCard({ city }) {
  return (
    <div className="rounded-3xl border border-border-soft bg-card-gradient p-4 shadow-soft transition hover:-translate-y-1 hover:shadow-card sm:p-5">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-info/10 text-info">
        <LocationCityIcon />
      </div>

      <h3 className="truncate text-sm font-extrabold text-text sm:text-base">
        {city.city}
      </h3>

      <p className="mt-2 text-xl font-extrabold text-primary">
        {city.customersCount}
      </p>

      <p className="mt-1 text-xs text-text-muted">customers</p>

      <div className="mt-4 space-y-2">
        {city.customers.slice(0, 3).map((customer) => (
          <Link
            key={customer.id}
            to={`/admin/customers/${customer.id}`}
            className="block truncate text-xs font-semibold text-text-muted hover:text-primary"
          >
            {customer.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function ActiveCustomerCard({ item }) {
  const { customer, task } = item;

  return (
    <div className="rounded-3xl border border-border-soft bg-card-gradient p-4 shadow-soft transition hover:-translate-y-1 hover:shadow-card sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-text sm:text-base">
            {customer.name}
          </h3>

          <p className="mt-2 text-xs text-text-muted">
            Task:{" "}
            <span className="font-semibold text-text">
              {task.title || "Service task"}
            </span>
          </p>

          <p className="mt-1 text-xs text-text-muted">
            Service:{" "}
            <span className="font-semibold text-text">
              {task.service?.name || task.category?.name || "N/A"}
            </span>
          </p>

          <p className="mt-1 text-xs text-text-muted">
            Location:{" "}
            <span className="font-semibold text-text">
              {task.location || customer.location?.city || "N/A"}
            </span>
          </p>

          <p className="mt-1 text-xs text-text-muted">
            Craftsman:{" "}
            <span className="font-semibold text-text">
              {task.craftsman?.user?.name || "Not available"}
            </span>
          </p>
        </div>

        <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
          {task.status}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <a
          href={`tel:${customer.phoneNumber || ""}`}
          className="rounded-2xl border border-border-soft bg-background px-4 py-3 text-center text-xs font-bold text-primary transition hover:bg-background-light"
        >
          Call
        </a>

        <a
          href={`mailto:${customer.email || ""}`}
          className="rounded-2xl border border-border-soft bg-background px-4 py-3 text-center text-xs font-bold text-primary transition hover:bg-background-light"
        >
          Email
        </a>

        <Link
          to={`/admin/customers/${customer.id}`}
          className="rounded-2xl bg-primary-gradient px-4 py-3 text-center text-xs font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated"
        >
          Profile
        </Link>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, note, color }) {
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
            {value}
          </p>

          <p className="hidden text-[10px] text-text-muted sm:block">{note}</p>
        </div>
      </div>
    </div>
  );
}

function MiniCount({ label, value }) {
  return (
    <div className="rounded-xl bg-background p-2 text-center">
      <p className="text-sm font-extrabold text-primary sm:text-base">
        {value || 0}
      </p>

      <p className="text-[10px] font-semibold text-text-muted">{label}</p>
    </div>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div className="mb-4">
      <h2 className="font-heading text-xl font-bold text-primary sm:text-2xl">
        {title}
      </h2>

      <p className="mt-1 text-xs text-text-muted sm:text-sm">{description}</p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="mb-8 rounded-3xl border border-dashed border-border-soft bg-card-gradient p-8 text-center shadow-soft">
      <p className="text-sm font-bold text-text">{message}</p>
    </div>
  );
}
