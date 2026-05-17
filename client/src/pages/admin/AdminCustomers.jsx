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
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomerInsights();
  }, [backendUrl]);

  if (loading) {
    return <p className="text-text-muted">Loading customers...</p>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-semibold text-primary-light mb-2">
            Customer Management
          </p>

          <h1 className="text-3xl font-extrabold text-primary">Customers</h1>

          <p className="text-text-muted mt-2">
            Understand your customer base, active service experiences, and top
            customers by task orders.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCustomerInsights}
          className="w-fit inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary-light transition"
        >
          <RefreshIcon fontSize="small" />
          Refresh
        </button>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <SummaryCard
          icon={<PeopleAltIcon />}
          label="Total Customers"
          value={allCustomers.length}
          note="Registered customer accounts"
          color="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          icon={<LocationCityIcon />}
          label="Cities"
          value={customersByCity.length}
          note="Cities with customers"
          color="bg-indigo-50 text-indigo-600"
        />

        <SummaryCard
          icon={<BuildCircleIcon />}
          label="Active Customers"
          value={customersWithInProgressTasks.length}
          note="Customers with in-progress tasks"
          color="bg-orange-50 text-orange-600"
        />
      </section>

      {/* Section 1 */}
      <SectionHeader
        title="Top Customers"
        description="Customers ranked by the number of tasks they ordered."
      />

      {topCustomers.length === 0 ? (
        <EmptyState message="No customers found." />
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
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

      {/* Section 2 */}
      <SectionHeader
        title="Customers by City"
        description="Cities where CraftConnect currently has customers."
      />

      {customersByCity.length === 0 ? (
        <EmptyState message="No city data found." />
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          {customersByCity.map((city) => (
            <CityCard key={city.city} city={city} />
          ))}
        </section>
      )}

      {/* Section 3 */}
      <SectionHeader
        title="Customers With Tasks In Progress"
        description="Contact these customers to check how their service experience is going."
      />

      {customersWithInProgressTasks.length === 0 ? (
        <EmptyState message="No customers currently have in-progress tasks." />
      ) : (
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-10">
          {customersWithInProgressTasks.map((item) => (
            <ActiveCustomerCard
              key={`${item.customer.id}-${item.task.id}`}
              item={item}
            />
          ))}
        </section>
      )}

      {/* All Customers */}
      <SectionHeader
        title="All Customers"
        description="Complete customer list."
      />

      {allCustomers.length === 0 ? (
        <EmptyState message="No customers found." />
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
  );
}

function CustomerCard({ customer, badge, highlight }) {
  return (
    <Link
      to={`/admin/customers/${customer.id}`}
      className="block bg-white rounded-3xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-1 transition"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-text">{customer.name}</h3>

            {customer.isAccountVerified ? (
              <VerifiedIcon className="text-green-600" fontSize="small" />
            ) : (
              <ErrorOutlineOutlinedIcon
                className="text-orange-500"
                fontSize="small"
              />
            )}
          </div>

          <p className="text-sm text-text-muted mt-1">
            {customer.isAccountVerified ? "Verified" : "Not verified"}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {badge && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary text-white">
              {badge}
            </span>
          )}

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-bg text-primary">
            {highlight}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm text-text-muted">
        <p className="flex items-center gap-2">
          <EmailIcon fontSize="small" />
          {customer.email}
        </p>

        <p className="flex items-center gap-2">
          <PhoneIcon fontSize="small" />
          {customer.phoneNumber || "No phone number"}
        </p>

        <p className="flex items-center gap-2">
          <LocationOnIcon fontSize="small" />
          {customer.location?.city || "Unknown city"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-5">
        <MiniCount label="Pending" value={customer.pendingTasksCount} />
        <MiniCount label="Active" value={customer.inProgressTasksCount} />
        <MiniCount label="Done" value={customer.completedTasksCount} />
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
        <p className="text-sm font-bold text-primary">Open profile</p>
        <ArrowForwardIosIcon fontSize="small" className="text-primary" />
      </div>
    </Link>
  );
}

function CityCard({ city }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
        <LocationCityIcon />
      </div>

      <h3 className="font-extrabold text-text">{city.city}</h3>

      <p className="text-3xl font-extrabold text-primary mt-2">
        {city.customersCount}
      </p>

      <p className="text-sm text-text-muted mt-1">customers</p>

      <div className="mt-4 space-y-2">
        {city.customers.slice(0, 3).map((customer) => (
          <Link
            key={customer.id}
            to={`/admin/customers/${customer.id}`}
            className="block text-sm font-semibold text-text-muted hover:text-primary truncate"
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
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-text">{customer.name}</h3>

          <p className="text-sm text-text-muted mt-1">
            Task:{" "}
            <span className="font-semibold text-text">
              {task.title || "Service task"}
            </span>
          </p>

          <p className="text-sm text-text-muted mt-1">
            Service:{" "}
            <span className="font-semibold text-text">
              {task.service?.name || task.category?.name || "N/A"}
            </span>
          </p>

          <p className="text-sm text-text-muted mt-1">
            Location:{" "}
            <span className="font-semibold text-text">
              {task.location || customer.location?.city || "N/A"}
            </span>
          </p>

          <p className="text-sm text-text-muted mt-1">
            Craftsman:{" "}
            <span className="font-semibold text-text">
              {task.craftsman?.user?.name || "Not available"}
            </span>
          </p>
        </div>

        <span className="w-fit text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-600">
          {task.status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
        <a
          href={`tel:${customer.phoneNumber || ""}`}
          className="text-center py-3 rounded-2xl bg-bg text-primary font-bold hover:bg-primary hover:text-white transition"
        >
          Call
        </a>

        <a
          href={`mailto:${customer.email || ""}`}
          className="text-center py-3 rounded-2xl bg-bg text-primary font-bold hover:bg-primary hover:text-white transition"
        >
          Email
        </a>

        <Link
          to={`/admin/customers/${customer.id}`}
          className="text-center py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary-light transition"
        >
          Profile
        </Link>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, note, color }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold text-text-muted">{label}</p>
        <p className="text-3xl font-extrabold text-text mt-1">{value}</p>
        <p className="text-xs text-text-muted mt-1">{note}</p>
      </div>
    </div>
  );
}

function MiniCount({ label, value }) {
  return (
    <div className="p-3 rounded-2xl bg-bg text-center">
      <p className="text-lg font-extrabold text-primary">{value || 0}</p>
      <p className="text-xs font-semibold text-text-muted">{label}</p>
    </div>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-extrabold text-text">{title}</h2>
      <p className="text-text-muted mt-1">{description}</p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center mb-10">
      <p className="font-bold text-text">{message}</p>
    </div>
  );
}
