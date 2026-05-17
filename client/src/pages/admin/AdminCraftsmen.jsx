import * as React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

import EngineeringIcon from "@mui/icons-material/Engineering";
import VerifiedIcon from "@mui/icons-material/Verified";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import BlockIcon from "@mui/icons-material/Block";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";

const filterTabs = [
  "All",
  "Approved",
  "Suspended",
  "High Warning",
  "Unverified",
];

export default function AdminCraftsmen() {
  const { backendUrl, statusStyles, warningStyles } =
    React.useContext(AppContext);

  const [craftsmen, setCraftsmen] = React.useState([]);
  const [applications, setApplications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoadingId, setActionLoadingId] = React.useState(null);
  const [activeFilter, setActiveFilter] = React.useState("All");
  const [searchTerm, setSearchTerm] = React.useState("");

  const fetchCraftsmenPage = async () => {
    try {
      setLoading(true);

      const [craftsmenRes, applicationsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/craftsmen`),
        axios.get(`${backendUrl}/api/admin/craftsmen/applications`),
      ]);

      setCraftsmen(Array.isArray(craftsmenRes.data) ? craftsmenRes.data : []);
      setApplications(
        Array.isArray(applicationsRes.data) ? applicationsRes.data : [],
      );
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load craftsmen");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCraftsmenPage();
  }, [backendUrl]);

  const suspendCraftsman = async (craftsmanId) => {
    try {
      setActionLoadingId(craftsmanId);

      const { data } = await axios.patch(
        `${backendUrl}/api/admin/craftsmen/applications/${craftsmanId}/status`,
        {
          status: "SUSPENDED",
        },
      );
      toast.success(data.message || "Craftsman suspended successfully");
      await fetchCraftsmenPage();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to suspend craftsman",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const restoreCraftsman = async (craftsmanId) => {
    try {
      setActionLoadingId(craftsmanId);

      const { data } = await axios.patch(
        `${backendUrl}/api/admin/craftsmen/restore/${craftsmanId}`,
      );

      toast.success(data.message || "Craftsman restored successfully");
      await fetchCraftsmenPage();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to restore craftsman",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const counts = React.useMemo(() => {
    const total = craftsmen.length;

    const approved = craftsmen.filter(
      (craftsman) => craftsman.craftsman?.status === "APPROVED",
    ).length;

    const suspended = craftsmen.filter(
      (craftsman) => craftsman.craftsman?.status === "SUSPENDED",
    ).length;

    const highWarning = craftsmen.filter(
      (craftsman) => craftsman.craftsman?.warningLevel === "HIGH",
    ).length;

    const unverified = craftsmen.filter(
      (craftsman) => !craftsman.isAccountVerified,
    ).length;

    return {
      total,
      approved,
      suspended,
      highWarning,
      unverified,
      pendingApplications: applications.length,
    };
  }, [craftsmen, applications]);

  const filteredCraftsmen = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return craftsmen.filter((craftsman) => {
      const status = craftsman.craftsman?.status || "UNKNOWN";
      const warningLevel = craftsman.craftsman?.warningLevel || "NONE";

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Approved" && status === "APPROVED") ||
        (activeFilter === "Suspended" && status === "SUSPENDED") ||
        (activeFilter === "High Warning" && warningLevel === "HIGH") ||
        (activeFilter === "Unverified" && !craftsman.isAccountVerified);

      const matchesSearch =
        !term ||
        craftsman.name?.toLowerCase().includes(term) ||
        craftsman.email?.toLowerCase().includes(term) ||
        craftsman.phoneNumber?.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [craftsmen, activeFilter, searchTerm]);

  if (loading) {
    return <p className="text-text-muted">Loading craftsmen...</p>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-semibold text-primary-light mb-2">
            Craftsman Management
          </p>

          <h1 className="text-3xl font-extrabold text-primary">Craftsmen</h1>

          <p className="text-text-muted mt-2">
            Review craftsmen, warning levels, account verification, and
            moderation actions.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCraftsmenPage}
          className="w-fit inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary-light transition"
        >
          <RefreshIcon fontSize="small" />
          Refresh
        </button>
      </div>

      <section className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-6 gap-5 mb-8">
        <SummaryCard
          icon={<EngineeringIcon />}
          label="Total"
          value={counts.total}
          note="All craftsmen"
          color="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          icon={<VerifiedIcon />}
          label="Approved"
          value={counts.approved}
          note="Active craftsmen"
          color="bg-green-50 text-green-600"
        />

        <SummaryCard
          icon={<BlockIcon />}
          label="Suspended"
          value={counts.suspended}
          note="Restricted accounts"
          color="bg-red-50 text-red-600"
        />

        <SummaryCard
          icon={<WarningAmberIcon />}
          label="High Warning"
          value={counts.highWarning}
          note="Needs attention"
          color="bg-orange-50 text-orange-600"
        />

        <SummaryCard
          icon={<ErrorOutlineOutlinedIcon />}
          label="Unverified"
          value={counts.unverified}
          note="Email not verified"
          color="bg-yellow-50 text-yellow-700"
        />

        <SummaryCard
          icon={<EngineeringIcon />}
          label="Applications"
          value={counts.pendingApplications}
          note="Pending review"
          color="bg-indigo-50 text-indigo-600"
        />
      </section>

      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-bg text-text-muted hover:text-primary"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="relative w-full xl:w-80">
            <SearchIcon
              fontSize="small"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-bg border border-gray-100 outline-none text-sm focus:border-primary"
            />
          </div>
        </div>
      </section>

      <SectionHeader
        title="All Craftsmen"
        description="Each card opens the full admin craftsman profile."
      />

      {filteredCraftsmen.length === 0 ? (
        <EmptyState message="No craftsmen matched your filters." />
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCraftsmen.map((craftsman) => (
            <CraftsmanCard
              key={craftsman.id}
              craftsman={craftsman}
              actionLoading={actionLoadingId === craftsman.id}
              onSuspend={() => {
                console.log("Craftsman:", craftsman.id);
                suspendCraftsman(craftsman.id);
              }}
              onRestore={() => restoreCraftsman(craftsman.id)}
              statusStyles={statusStyles}
              warningStyles={warningStyles}
            />
          ))}
        </section>
      )}
    </div>
  );
}

function CraftsmanCard({
  craftsman,
  actionLoading,
  onSuspend,
  onRestore,
  statusStyles,
  warningStyles,
}) {
  const status = craftsman.craftsman?.status || "UNKNOWN";
  const warningLevel = craftsman.craftsman?.warningLevel || "NONE";
  const isSuspended = status === "SUSPENDED";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-text truncate">
              {craftsman.name}
            </h3>

            {craftsman.isAccountVerified ? (
              <VerifiedIcon className="text-green-600" fontSize="small" />
            ) : (
              <ErrorOutlineOutlinedIcon
                className="text-orange-500"
                fontSize="small"
              />
            )}
          </div>

          <p className="text-sm text-text-muted mt-1">
            {craftsman.isAccountVerified ? "Verified" : "Not verified"}
          </p>
        </div>

        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            statusStyles[status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="space-y-2 text-sm text-text-muted">
        <p className="flex items-center gap-2">
          <EmailIcon fontSize="small" />
          <span className="truncate">{craftsman.email}</span>
        </p>

        <p className="flex items-center gap-2">
          <PhoneIcon fontSize="small" />
          <span>{craftsman.phoneNumber || "No phone number"}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <InfoBadge
          label="Warning"
          value={warningLevel}
          className={warningStyles[warningLevel] || "bg-gray-100 text-gray-600"}
        />

        <InfoBadge
          label="Role"
          value={craftsman.role}
          className="bg-bg text-primary"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
        {isSuspended ? (
          <button
            type="button"
            disabled={actionLoading}
            onClick={onRestore}
            className="py-3 rounded-2xl bg-green-600 text-white font-bold hover:bg-green-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <RestartAltIcon fontSize="small" />
            {actionLoading ? "Restoring..." : "Restore"}
          </button>
        ) : (
          <button
            type="button"
            disabled={actionLoading}
            onClick={onSuspend}
            className="py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <BlockIcon fontSize="small" />
            {actionLoading ? "Suspending..." : "Suspend"}
          </button>
        )}

        <Link
          to={`/admin/craftsmen/${craftsman.id}`}
          className="py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary-light transition flex items-center justify-center gap-2"
        >
          Profile
          <ArrowForwardIosIcon fontSize="small" />
        </Link>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, note, color }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-muted">{label}</p>
        <p className="text-2xl font-extrabold text-text mt-1">{value}</p>
        <p className="text-xs text-text-muted mt-1">{note}</p>
      </div>
    </div>
  );
}

function InfoBadge({ label, value, className }) {
  return (
    <div className="p-3 rounded-2xl bg-bg">
      <p className="text-xs font-bold text-text-muted uppercase mb-2">
        {label}
      </p>

      <span
        className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${className}`}
      >
        {value}
      </span>
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
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">
      <p className="font-bold text-text">{message}</p>
    </div>
  );
}
