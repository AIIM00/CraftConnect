import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../../context/AppContext";

// MUI Icons
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import RefreshIcon from "@mui/icons-material/Refresh";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

export default function AdminDashboard() {
  const { backendUrl } = React.useContext(AppContext);

  const [loading, setLoading] = React.useState(true);

  const [stats, setStats] = React.useState({
    totalCustomers: 0,
    totalCraftsmen: 0,
    pendingApplications: 0,
    inProgressTasks: 0,
    flaggedCraftsmen: 0,
    lowestReviewAverage: "N/A",
    unassignableTasks: 0,
    reassignmentRequests: 0,
  });

  const [recentApplications, setRecentApplications] = React.useState([]);
  const [lowestReviews, setLowestReviews] = React.useState([]);
  const [flaggedList, setFlaggedList] = React.useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        customersRes,
        craftsmenRes,
        applicationsRes,
        inProgressTasksRes,
        flaggedCraftsmenRes,
        reviewsRes,
        unassignableTasksRes,
        reassignmentRequestsRes,
      ] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/customers`, {
          withCredentials: true,
        }),
        axios.get(`${backendUrl}/api/admin/craftsmen`, {
          withCredentials: true,
        }),
        axios.get(`${backendUrl}/api/admin/craftsmen/applications`, {
          withCredentials: true,
        }),
        axios.get(`${backendUrl}/api/admin/tasks/in-progress`, {
          withCredentials: true,
        }),
        axios.get(`${backendUrl}/api/admin/warnings/flagged-craftsmen`, {
          withCredentials: true,
        }),
        axios.get(`${backendUrl}/api/admin/reviews`, {
          withCredentials: true,
        }),
        axios.get(`${backendUrl}/api/admin/tasks/unassignable`, {
          withCredentials: true,
        }),
        axios.get(`${backendUrl}/api/admin/reassignment-requests`, {
          withCredentials: true,
        }),
      ]);

      const customers = Array.isArray(customersRes.data)
        ? customersRes.data
        : [];

      const craftsmen = Array.isArray(craftsmenRes.data)
        ? craftsmenRes.data
        : [];

      const applications = Array.isArray(applicationsRes.data)
        ? applicationsRes.data
        : [];

      const inProgressTasks = Array.isArray(inProgressTasksRes.data)
        ? inProgressTasksRes.data
        : [];

      const flaggedCraftsmen = Array.isArray(flaggedCraftsmenRes.data)
        ? flaggedCraftsmenRes.data
        : [];

      const reviews = Array.isArray(reviewsRes.data) ? reviewsRes.data : [];
      const unassignableTasks = unassignableTasksRes.data?.tasks || [];
      const reassignmentRequests = reassignmentRequestsRes.data?.requests || [];

      const sortedReviews = [...reviews].sort((a, b) => {
        const aAverage = Number(a.detailedAverage ?? a.rating ?? 5);
        const bAverage = Number(b.detailedAverage ?? b.rating ?? 5);

        return aAverage - bAverage;
      });

      const lowestReview = sortedReviews[0];

      setStats({
        totalCustomers: customers.length,
        totalCraftsmen: craftsmen.length,
        pendingApplications: applications.length,
        inProgressTasks: inProgressTasks.length,
        flaggedCraftsmen: flaggedCraftsmen.length,
        lowestReviewAverage: lowestReview
          ? Number(lowestReview.detailedAverage ?? lowestReview.rating).toFixed(
              1,
            )
          : "N/A",
        unassignableTasks: unassignableTasks.length,
        reassignmentRequests: reassignmentRequests.length,
      });

      setRecentApplications(applications.slice(0, 5));

      setLowestReviews(
        sortedReviews.filter(
          (review) => Number(review.detailedAverage ?? review.rating ?? 5) < 3,
        ),
      );

      setFlaggedList(flaggedCraftsmen.slice(0, 5));
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to load admin dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDashboardData();
  }, [backendUrl]);

  if (loading) {
    return (
      <section className="min-h-screen bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center">
          <div className="w-full rounded-3xl border border-border-soft bg-card-gradient p-8 text-center shadow-card">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
              <BuildCircleIcon />
            </div>

            <h1 className="font-heading text-lg font-bold text-primary">
              Loading Dashboard
            </h1>

            <p className="mt-2 text-xs text-text-muted">
              Please wait while admin data is loading.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-container">
        <div className="mb-8 overflow-hidden rounded-3xl border border-border-soft bg-primary-gradient p-6 text-white shadow-card sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">
                Admin Overview
              </p>

              <h1 className="font-heading text-xl font-bold sm:text-4xl lg:text-5xl">
                Admin Dashboard
              </h1>

              <p className="mt-4 max-w-3xl text-[12px] leading-7 text-white/80 sm:text-base">
                Monitor customers, craftsmen, applications, active tasks,
                warnings, and service quality from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchDashboardData}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl bg-secondary-gradient px-5 py-3 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <RefreshIcon fontSize="small" />
              Refresh
            </button>
          </div>
        </div>

        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<PeopleAltIcon />}
            label="Total Customers"
            value={stats.totalCustomers}
            note="Registered customer accounts"
            color="bg-primary/10 text-primary"
          />

          <StatCard
            icon={<EngineeringIcon />}
            label="Total Craftsmen"
            value={stats.totalCraftsmen}
            note="Registered craftsman accounts"
            color="bg-info/10 text-info"
          />

          <StatCard
            icon={<AssignmentTurnedInIcon />}
            label="Pending Applications"
            value={stats.pendingApplications}
            note="Craftsmen waiting for review"
            color="bg-secondary/10 text-secondary"
          />

          <StatCard
            icon={<BuildCircleIcon />}
            label="In-progress Tasks"
            value={stats.inProgressTasks}
            note="Active customer jobs"
            color="bg-primary/10 text-primary"
          />

          <StatCard
            icon={<WarningAmberIcon />}
            label="Flagged Craftsmen"
            value={stats.flaggedCraftsmen}
            note="High warning count"
            color="bg-danger/10 text-danger"
          />

          <StatCard
            icon={<StarHalfIcon />}
            label="Lowest Review Average"
            value={stats.lowestReviewAverage}
            note="Lowest detailed score"
            color="bg-warning/10 text-warning"
          />

          <StatCard
            icon={<AssignmentLateIcon />}
            label="Unassignable Tasks"
            value={stats.unassignableTasks}
            note="Need admin review"
            color="bg-secondary/10 text-secondary"
          />

          <StatCard
            icon={<SwapHorizIcon />}
            label="Reassignment Requests"
            value={stats.reassignmentRequests}
            note="Withdrawal requests"
            color="bg-info/10 text-info"
          />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <DashboardPanel
            title="Recent Applications"
            description="Latest craftsman applications awaiting review."
          >
            {recentApplications.length === 0 ? (
              <EmptyState message="No pending applications." />
            ) : (
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div
                    key={application.id}
                    className="rounded-2xl border border-border-soft bg-background p-4 shadow-soft"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-text text-sm">
                          {application.user?.name || "Unknown applicant"}
                        </p>

                        <p className="mt-1 text-xs text-text-muted">
                          {application.user?.email || "No email"}
                        </p>
                      </div>

                      <span className="rounded-full bg-secondary/10 px-3 py-1 text-[10px] font-bold text-secondary">
                        {application.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-text-muted">
                      <p>
                        Category:{" "}
                        <span className="font-semibold text-text">
                          {application.category?.name || "Not selected"}
                        </span>
                      </p>

                      <p>
                        Experience:{" "}
                        <span className="font-semibold text-text">
                          {application.yearsOfExperience ?? "N/A"} years
                        </span>
                      </p>

                      <p>
                        City:{" "}
                        <span className="font-semibold text-text">
                          {application.city || "N/A"}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardPanel>

          <DashboardPanel
            title="Lowest Reviews"
            description="Reviews that may need admin attention."
          >
            {lowestReviews.length === 0 ? (
              <EmptyState message="No low reviews right now." />
            ) : (
              <div className="space-y-4">
                {lowestReviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-border-soft bg-background p-4 shadow-soft"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-text text-xs">
                          {review.task?.title || "Unknown task"}
                        </p>

                        <p className="mt-1 text-xs text-text-muted">
                          Craftsman:{" "}
                          {review.craftsman?.user?.name || "Unknown craftsman"}
                        </p>
                      </div>

                      <span className="rounded-full bg-warning/10 px-3 py-1 text-[10px] font-bold text-warning">
                        {Number(
                          review.detailedAverage ?? review.rating ?? 0,
                        ).toFixed(1)}
                        /5
                      </span>
                    </div>

                    {review.issueTags?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {review.issueTags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border-soft bg-card-gradient px-3 py-1 text-xs font-semibold text-text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-text-muted">
                      {review.comment || "No comment provided."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </DashboardPanel>

          <DashboardPanel
            title="Flagged Craftsmen"
            description="Craftsmen with warnings or risk signals."
          >
            {flaggedList.length === 0 ? (
              <EmptyState message="No flagged craftsmen right now." />
            ) : (
              <div className="space-y-4">
                {flaggedList.map((craftsman) => (
                  <div
                    key={craftsman.craftsmanId}
                    className="rounded-2xl border border-danger/20 bg-danger/10 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-text">
                          {craftsman.name || "Unknown craftsman"}
                        </p>

                        <p className="mt-1 text-sm text-text-muted">
                          {craftsman.email || "No email"}
                        </p>
                      </div>

                      <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-bold text-danger">
                        {craftsman.level || "HIGH"}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-danger">
                      {craftsman.message ||
                        `${craftsman.warningsCount || 0} warnings found.`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </DashboardPanel>
        </section>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value, note, color }) {
  return (
    <div className="rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-xs font-bold text-text-muted">{label}</p>

          <p className="mt-1 text-xl font-bold text-primary">{value}</p>

          <p className="mt-1 text-[10px] text-text-muted">{note}</p>
        </div>
      </div>
    </div>
  );
}

function DashboardPanel({ title, description, children }) {
  return (
    <div className="rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-card sm:p-6">
      <div className="mb-5">
        <h2 className="font-heading text-xl font-bold text-primary">{title}</h2>

        <p className="mt-1 text-xs text-text-muted">{description}</p>
      </div>

      {children}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-border-soft bg-background p-10 text-center">
      <p className="font-bold text-text text-xs">{message}</p>
    </div>
  );
}
