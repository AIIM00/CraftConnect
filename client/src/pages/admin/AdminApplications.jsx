import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const AdminApplications = () => {
  const { backendUrl } = React.useContext(AppContext);

  const [applications, setApplications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [addOpenFor, setAddOpenFor] = React.useState(null);
  const [categoryName, setCategoryName] = React.useState("");
  const [serviceName, setServiceName] = React.useState("");
  const [addLoading, setAddLoading] = React.useState(false);

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
  const openAddForm = (application) => {
    setAddOpenFor(application.id);
    setCategoryName(
      application.customCategory || application.category?.name || "",
    );
    setServiceName(
      application.customService || application.service?.name || "",
    );
  };

  const submitCustomCategoryService = async (application) => {
    try {
      setAddLoading(true);

      const { data } = await axios.patch(
        `${backendUrl}/api/admin/craftsmen/applications/${application.id}/custom-category-service`,
        {
          categoryName,
          serviceName,
        },
        { withCredentials: true },
      );

      toast.success(data.message || "Category and service added");
      setAddOpenFor(null);
      setCategoryName("");
      setServiceName("");
      getApplications();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to add category/service",
      );
    } finally {
      setAddLoading(false);
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
                  {application.category?.name ||
                    application.customCategory ||
                    "Not selected"}
                </p>
                <p>
                  <strong>Service:</strong>{" "}
                  {application.service?.name ||
                    application.customService ||
                    "Not selected"}
                </p>
                {(application.customCategory || application.customService) && (
                  <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
                    <p className="font-bold text-orange-700">
                      This application contains a custom category or service.
                    </p>

                    {addOpenFor !== application.id ? (
                      <button
                        type="button"
                        onClick={() => openAddForm(application)}
                        className="mt-3 rounded-lg bg-orange-600 px-4 py-2 font-bold text-white hover:bg-orange-700"
                      >
                        Add Category / Service
                      </button>
                    ) : (
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-bold text-gray-700">
                            Category
                          </label>
                          <input
                            value={categoryName}
                            disabled={!application.customCategory}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 disabled:bg-gray-100"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-bold text-gray-700">
                            Service
                          </label>
                          <input
                            value={serviceName}
                            disabled={!application.customService}
                            onChange={(e) => setServiceName(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 disabled:bg-gray-100"
                          />
                        </div>

                        <div className="flex gap-2 md:col-span-2">
                          <button
                            type="button"
                            disabled={addLoading}
                            onClick={() =>
                              submitCustomCategoryService(application)
                            }
                            className="rounded-lg bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700 disabled:opacity-60"
                          >
                            {addLoading ? "Adding..." : "Save"}
                          </button>

                          <button
                            type="button"
                            onClick={() => setAddOpenFor(null)}
                            className="rounded-lg bg-gray-200 px-4 py-2 font-bold text-gray-700 hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                  <h3 className="font-bold text-gray-800 mb-2">Working Days</h3>

                  <div className="flex flex-wrap gap-2">
                    {(application.workingDays || []).map((day) => (
                      <span
                        key={day}
                        className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {application.scenarioQA && (
                <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                  <h3 className="font-bold text-gray-800 mb-3">
                    Scenario Answers
                  </h3>

                  <AnswerCard
                    label="Emergency during a job"
                    value={application.scenarioQA.emergency}
                  />

                  <AnswerCard
                    label="Difficult customer"
                    value={application.scenarioQA.difficultCustomer}
                  />
                </div>
              )}

              {application.workBehaviorQA && (
                <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                  <h3 className="font-bold text-gray-800 mb-3">
                    Work Behavior Answers
                  </h3>

                  <AnswerCard
                    label="Punctuality"
                    value={application.workBehaviorQA.punctuality}
                  />

                  <AnswerCard
                    label="Safety"
                    value={application.workBehaviorQA.safety}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
function AnswerCard({ label, value }) {
  return (
    <div className="mb-3 rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        {value || "No answer provided."}
      </p>
    </div>
  );
}

export default AdminApplications;
