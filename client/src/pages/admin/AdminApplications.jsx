import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const AdminApplications = () => {
  const { backendUrl } = React.useContext(AppContext);

  const [applications, setApplications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const getApplications = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/admin/craftsmen/applications`,
        {
          withCredentials: true,
        },
      );
      console.log("Fetched applications:", data);

      setApplications(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (craftsmanId, status) => {
    if (!craftsmanId) {
      toast.error("Missing craftsman ID");
      return;
    }
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/admin/craftsmen/applications/${craftsmanId}/status`,
        { status },
        { withCredentials: true },
      );

      toast.success(data.message || "Application updated successfully");
      getApplications();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update application",
      );
    }
  };

  React.useEffect(() => {
    getApplications();
  }, []);

  if (loading) {
    return <div className="p-6 text-lg">Loading applications...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Craftsman Applications</h1>

      {applications.length === 0 ? (
        <p className="text-gray-500">No applications found.</p>
      ) : (
        <div className="grid gap-5">
          {applications.map((application) => (
            <div
              key={application.id}
              className="bg-white rounded-xl shadow p-5 border border-gray-200"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {application.user?.name}
                  </h2>
                  <p className="text-gray-500">{application.user?.email}</p>
                  <p className="text-sm mt-1">
                    Status:{" "}
                    <span className="font-semibold">{application.status}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateApplicationStatus(application.user?.id, "APPROVED")
                    }
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateApplicationStatus(application.user?.id, "REJECTED")
                    }
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>

              <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm">
                <p>
                  <strong>Category:</strong>{" "}
                  {application.category?.name || "Not selected"}
                </p>

                <p>
                  <strong>Experience:</strong>{" "}
                  {application.yearsOfExperience ?? "N/A"} years
                </p>

                <p>
                  <strong>City:</strong> {application.city || "N/A"}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {[application.address1, application.apartment]
                    .filter(Boolean)
                    .join(", ") || "N/A"}
                </p>

                <p>
                  <strong>Max Travel Distance:</strong>{" "}
                  {application.maxTravelDistance ?? "N/A"} km
                </p>

                <p>
                  <strong>Submitted:</strong>{" "}
                  {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>

              {application.workingDays && (
                <div className="mt-4">
                  <strong>Working Days:</strong>
                  <pre className="bg-gray-100 p-3 rounded mt-2 text-xs overflow-auto">
                    {JSON.stringify(application.workingDays, null, 2)}
                  </pre>
                </div>
              )}

              {application.scenarioQA && (
                <div className="mt-4">
                  <strong>Scenario Answers:</strong>
                  <pre className="bg-gray-100 p-3 rounded mt-2 text-xs overflow-auto">
                    {JSON.stringify(application.scenarioQA, null, 2)}
                  </pre>
                </div>
              )}

              {application.workBehaviorQA && (
                <div className="mt-4">
                  <strong>Work Behavior Answers:</strong>
                  <pre className="bg-gray-100 p-3 rounded mt-2 text-xs overflow-auto">
                    {JSON.stringify(application.workBehaviorQA, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
