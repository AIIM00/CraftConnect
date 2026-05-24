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
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

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
        axios.get(`${backendUrl}/api/admin/craftsmen`, {
          withCredentials: true,
        }),
        axios.get(`${backendUrl}/api/admin/craftsmen/applications`, {
          withCredentials: true,
        }),
      ]);

      setCraftsmen(Array.isArray(craftsmenRes.data) ? craftsmenRes.data : []);
      setApplications(
        Array.isArray(applicationsRes.data) ? applicationsRes.data : [],
      );
    } catch (error) {
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
        { status: "SUSPENDED" },
        { withCredentials: true },
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
        {},
        { withCredentials: true },
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
    return (
      <section className="min-h-screen bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-md rounded-3xl border border-border-soft bg-card-gradient p-8 text-center shadow-card">
          <EngineeringIcon className="text-primary" />
          <p className="mt-4 font-bold text-primary">Loading craftsmen...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-container">
        <div className="mb-8 rounded-3xl border border-border-soft bg-primary-gradient p-6 text-white shadow-card sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                Admin Workspace
              </p>

              <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
                Craftsmen
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">
                Review craftsmen, warning levels, account verification, and
                moderation actions.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchCraftsmenPage}
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-secondary-gradient px-5 py-3 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <RefreshIcon fontSize="small" />
              Refresh
            </button>
          </div>
        </div>

        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <SummaryCard
            icon={<EngineeringIcon />}
            label="Total"
            value={counts.total}
            note="All craftsmen"
            color="bg-primary/10 text-primary"
          />

          <SummaryCard
            icon={<VerifiedIcon />}
            label="Approved"
            value={counts.approved}
            note="Active craftsmen"
            color="bg-success/10 text-success"
          />

          <SummaryCard
            icon={<BlockIcon />}
            label="Suspended"
            value={counts.suspended}
            note="Restricted accounts"
            color="bg-danger/10 text-danger"
          />

          <SummaryCard
            icon={<WarningAmberIcon />}
            label="High Warning"
            value={counts.highWarning}
            note="Needs attention"
            color="bg-warning/10 text-warning"
          />

          <SummaryCard
            icon={<ErrorOutlineOutlinedIcon />}
            label="Unverified"
            value={counts.unverified}
            note="Email not verified"
            color="bg-secondary/10 text-secondary"
          />

          <SummaryCard
            icon={<AssignmentTurnedInIcon />}
            label="Applications"
            value={counts.pendingApplications}
            note="Pending review"
            color="bg-info/10 text-info"
          />
        </section>

        <section className="mb-8 rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-card">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveFilter(tab)}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                      isActive
                        ? "bg-primary-gradient text-white shadow-card"
                        : "bg-background text-text-muted hover:bg-background-light hover:text-primary"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full xl:w-96">
              <SearchIcon
                fontSize="small"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, email, phone..."
                className="w-full rounded-2xl border border-border-soft bg-background py-3 pl-11 pr-4 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
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
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCraftsmen.map((craftsman) => (
              <CraftsmanCard
                key={craftsman.id}
                craftsman={craftsman}
                actionLoading={actionLoadingId === craftsman.id}
                onSuspend={() => suspendCraftsman(craftsman.id)}
                onRestore={() => restoreCraftsman(craftsman.id)}
                statusStyles={statusStyles}
                warningStyles={warningStyles}
              />
            ))}
          </section>
        )}
      </div>
    </section>
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
    <article className="rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-heading text-lg font-bold text-primary">
              {craftsman.name}
            </h3>

            {craftsman.isAccountVerified ? (
              <VerifiedIcon className="text-success" fontSize="small" />
            ) : (
              <ErrorOutlineOutlinedIcon
                className="text-secondary"
                fontSize="small"
              />
            )}
          </div>

          <p className="mt-1 text-[10px] text-text-muted">
            {craftsman.isAccountVerified ? "Verified" : "Not verified"}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-[12px] font-bold ${
            statusStyles[status] || "bg-background-light text-text-muted"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="space-y-3 text-[12px] text-text-muted">
        <p className="flex items-center gap-2">
          <EmailIcon fontSize="small" className="text-secondary" />
          <span className="truncate">{craftsman.email}</span>
        </p>

        <p className="flex items-center gap-2">
          <PhoneIcon fontSize="small" className="text-secondary" />
          <span>{craftsman.phoneNumber || "No phone number"}</span>
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <InfoBadge
          label="Warning"
          value={warningLevel}
          className={
            warningStyles[warningLevel] || "bg-background-light text-text-muted"
          }
        />

        <InfoBadge
          label="Role"
          value={craftsman.role}
          className="bg-primary/10 text-primary"
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {isSuspended ? (
          <button
            type="button"
            disabled={actionLoading}
            onClick={onRestore}
            className="flex items-center justify-center gap-2 rounded-2xl bg-success px-4 py-3 text-xs font-bold text-white transition hover:brightness-95 disabled:opacity-60"
          >
            <RestartAltIcon fontSize="small" />
            {actionLoading ? "Restoring..." : "Restore"}
          </button>
        ) : (
          <button
            type="button"
            disabled={actionLoading}
            onClick={onSuspend}
            className="flex items-center justify-center gap-2 rounded-2xl bg-danger px-4 py-3 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-60"
          >
            <BlockIcon fontSize="small" />
            {actionLoading ? "Suspending..." : "Suspend"}
          </button>
        )}

        <Link
          to={`/admin/craftsmen/${craftsman.id}`}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary-gradient px-4 py-3 text-xs font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated"
        >
          Profile
          <ArrowForwardIosIcon fontSize="small" />
        </Link>
      </div>
    </article>
  );
}

function SummaryCard({ icon, label, value, note, color }) {
  return (
    <div className="rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${color}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-bold text-text-muted">{label}</p>
          <p className="mt-1 text-md font-bold text-primary">{value}</p>
          <p className="mt-1 text-xs text-text-muted">{note}</p>
        </div>
      </div>
    </div>
  );
}

function InfoBadge({ label, value, className }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-background p-3 shadow-soft text-center">
      <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.08em] text-text-muted">
        {label}
      </p>

      <span
        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold ${className}`}
      >
        {value}
      </span>
    </div>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div className="mb-5">
      <h2 className="font-heading text-sm font-bold text-primary">{title}</h2>
      <p className="mt-1 text-sm text-text-muted">{description}</p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="rounded-3xl border border-dashed border-border-soft bg-card-gradient p-10 text-center shadow-soft">
      <p className="text-xs font-bold text-text">{message}</p>
    </div>
  );
}
