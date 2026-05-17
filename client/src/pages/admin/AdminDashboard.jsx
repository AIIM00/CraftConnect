import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import RefreshIcon from "@mui/icons-material/Refresh";

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
      ] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/customers`),
        axios.get(`${backendUrl}/api/admin/craftsmen`),
        axios.get(`${backendUrl}/api/admin/craftsmen/applications`),
        axios.get(`${backendUrl}/api/admin/tasks/in-progress`),
        axios.get(`${backendUrl}/api/admin/warnings/flagged-craftsmen`),
        axios.get(`${backendUrl}/api/admin/reviews`),
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
    return <p className="text-text-muted">Loading admin dashboard...</p>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-semibold text-primary-light mb-2">
            Admin Overview
          </p>

          <h1 className="text-3xl font-extrabold text-primary">
            Admin Dashboard
          </h1>

          <p className="text-text-muted mt-2">
            Monitor customers, craftsmen, applications, active tasks, warnings,
            and review quality.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardData}
          className="w-fit inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary-light transition"
        >
          <RefreshIcon fontSize="small" />
          Refresh
        </button>
      </div>

      <section className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        <StatCard
          icon={<PeopleAltIcon />}
          label="Total Customers"
          value={stats.totalCustomers}
          note="Registered customer accounts"
          color="bg-blue-50 text-blue-600"
        />

        <StatCard
          icon={<EngineeringIcon />}
          label="Total Craftsmen"
          value={stats.totalCraftsmen}
          note="Registered craftsman accounts"
          color="bg-indigo-50 text-indigo-600"
        />

        <StatCard
          icon={<AssignmentTurnedInIcon />}
          label="Pending Applications"
          value={stats.pendingApplications}
          note="Craftsmen waiting for review"
          color="bg-orange-50 text-orange-600"
        />

        <StatCard
          icon={<BuildCircleIcon />}
          label="In-progress Tasks"
          value={stats.inProgressTasks}
          note="Active customer jobs"
          color="bg-cyan-50 text-cyan-600"
        />

        <StatCard
          icon={<WarningAmberIcon />}
          label="Flagged Craftsmen"
          value={stats.flaggedCraftsmen}
          note="Craftsmen with high warning count"
          color="bg-red-50 text-red-600"
        />

        <StatCard
          icon={<StarHalfIcon />}
          label="Lowest Review Average"
          value={stats.lowestReviewAverage}
          note="Lowest detailed review score"
          color="bg-yellow-50 text-yellow-700"
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <DashboardPanel title="Recent Applications">
          {recentApplications.length === 0 ? (
            <EmptyState message="No pending applications." />
          ) : (
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div
                  key={application.id}
                  className="p-4 rounded-2xl bg-bg border border-gray-100"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-text">
                        {application.user?.name || "Unknown applicant"}
                      </p>

                      <p className="text-sm text-text-muted mt-1">
                        {application.user?.email || "No email"}
                      </p>
                    </div>

                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-600">
                      {application.status}
                    </span>
                  </div>

                  <div className="mt-3 text-sm text-text-muted space-y-1">
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

        <DashboardPanel title="Lowest Reviews">
          {lowestReviews.length === 0 ? (
            <EmptyState message="No reviews yet." />
          ) : (
            <div className="space-y-4">
              {lowestReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-2xl bg-bg border border-gray-100"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-text">
                        {review.task?.title || "Unknown task"}
                      </p>

                      <p className="text-sm text-text-muted mt-1">
                        Craftsman:{" "}
                        {review.craftsman?.user?.name || "Unknown craftsman"}
                      </p>
                    </div>

                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                      {Number(
                        review.detailedAverage ?? review.rating ?? 0,
                      ).toFixed(1)}
                      /5
                    </span>
                  </div>

                  {review.issueTags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {review.issueTags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-gray-200 text-text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-text-muted mt-3 line-clamp-2">
                    {review.comment || "No comment provided."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </DashboardPanel>

        <DashboardPanel title="Flagged Craftsmen">
          {flaggedList.length === 0 ? (
            <EmptyState message="No flagged craftsmen right now." />
          ) : (
            <div className="space-y-4">
              {flaggedList.map((craftsman) => (
                <div
                  key={craftsman.craftsmanId}
                  className="p-4 rounded-2xl bg-red-50 border border-red-100"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-text">
                        {craftsman.name || "Unknown craftsman"}
                      </p>

                      <p className="text-sm text-text-muted mt-1">
                        {craftsman.email || "No email"}
                      </p>
                    </div>

                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-600">
                      {craftsman.level || "HIGH"}
                    </span>
                  </div>

                  <p className="text-sm text-red-700 mt-3">
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

      <div>
        <p className="text-sm font-semibold text-text-muted">{label}</p>

        <p className="text-3xl font-extrabold text-text mt-1">{value}</p>

        <p className="text-xs text-text-muted mt-1">{note}</p>
      </div>
    </div>
  );
}

function DashboardPanel({ title, children }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-extrabold text-text mb-5">{title}</h2>
      {children}
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
