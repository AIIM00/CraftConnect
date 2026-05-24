import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddCircleIcon from "@mui/icons-material/AddCircle";

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
        { withCredentials: true },
      );

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
    return (
      <section className="min-h-screen bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-md rounded-3xl border border-border-soft bg-card-gradient p-8 text-center shadow-card">
          <AssignmentTurnedInIcon className="text-primary" />
          <p className="mt-4 font-bold text-primary">Loading applications...</p>
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
          <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
            Admin Workspace
          </p>

          <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
            Craftsman Applications
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">
            Review craftsman applications, approve qualified users, and add
            custom categories or services when needed.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border-soft bg-card-gradient p-10 text-center shadow-soft">
            <p className="font-bold text-primary">No applications found.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                addOpenFor={addOpenFor}
                categoryName={categoryName}
                serviceName={serviceName}
                addLoading={addLoading}
                setCategoryName={setCategoryName}
                setServiceName={setServiceName}
                setAddOpenFor={setAddOpenFor}
                openAddForm={openAddForm}
                submitCustomCategoryService={submitCustomCategoryService}
                updateApplicationStatus={updateApplicationStatus}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

function ApplicationCard({
  application,
  addOpenFor,
  categoryName,
  serviceName,
  addLoading,
  setCategoryName,
  setServiceName,
  setAddOpenFor,
  openAddForm,
  submitCustomCategoryService,
  updateApplicationStatus,
}) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <article className="overflow-hidden rounded-3xl border border-border-soft bg-card-gradient shadow-card">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
                <AssignmentTurnedInIcon />
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-primary">
                  {application.user?.name || "Unknown applicant"}
                </h2>

                <p className="mt-1 text-sm text-text-muted">
                  {application.user?.email || "No email"}
                </p>
              </div>
            </div>

            <span className="mt-4 inline-flex rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">
              {application.status}
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                updateApplicationStatus(application.user?.id, "APPROVED")
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-success px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:brightness-95"
            >
              <CheckCircleIcon fontSize="small" />
              Approve
            </button>

            <button
              type="button"
              onClick={() =>
                updateApplicationStatus(application.user?.id, "REJECTED")
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-danger px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:brightness-95"
            >
              <CancelIcon fontSize="small" />
              Reject
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <InfoItem
            icon={<ConstructionOutlinedIcon />}
            label="Category"
            value={
              application.category?.name ||
              application.customCategory ||
              "Not selected"
            }
          />

          <InfoItem
            icon={<ConstructionOutlinedIcon />}
            label="Service"
            value={
              application.service?.name ||
              application.customService ||
              "Not selected"
            }
          />

          <InfoItem
            icon={<CalendarMonthIcon />}
            label="Experience"
            value={`${application.yearsOfExperience ?? "N/A"} years`}
          />
        </div>

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-border-soft bg-background px-5 py-3 text-sm font-bold text-primary shadow-soft transition hover:bg-background-light"
        >
          {expanded ? "Hide details" : "View full details"}

          <KeyboardArrowDownIcon
            className={`transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {expanded && (
        <div className="max-h-[680px] overflow-y-auto border-t border-border-soft p-5 sm:p-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 text-center">
            <InfoItem
              icon={<LocationOnIcon />}
              label="City"
              value={application.city || "N/A"}
            />

            <InfoItem
              icon={<LocationOnIcon />}
              label="Address"
              value={
                [application.address1, application.apartment]
                  .filter(Boolean)
                  .join(", ") || "N/A"
              }
            />

            <InfoItem
              icon={<LocationOnIcon />}
              label="Max Distance"
              value={`${application.maxTravelDistance ?? "N/A"} km`}
            />
          </div>

          {(application.customCategory || application.customService) && (
            <div className="mt-6 rounded-3xl border border-secondary/20 bg-secondary/10 p-5">
              <p className="font-bold text-secondary">
                This application contains a custom category or service.
              </p>

              {addOpenFor !== application.id ? (
                <button
                  type="button"
                  onClick={() => openAddForm(application)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-secondary-gradient px-5 py-3 text-sm font-bold text-white shadow-card"
                >
                  <AddCircleIcon fontSize="small" />
                  Add Category / Service
                </button>
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Field label="Category">
                    <input
                      value={categoryName}
                      disabled={!application.customCategory}
                      onChange={(event) => setCategoryName(event.target.value)}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Service">
                    <input
                      value={serviceName}
                      disabled={!application.customService}
                      onChange={(event) => setServiceName(event.target.value)}
                      className={inputClass}
                    />
                  </Field>

                  <div className="flex gap-3 md:col-span-2">
                    <button
                      type="button"
                      disabled={addLoading}
                      onClick={() => submitCustomCategoryService(application)}
                      className="rounded-xl bg-success px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
                    >
                      {addLoading ? "Adding..." : "Save"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setAddOpenFor(null)}
                      className="rounded-xl border border-border-soft bg-background px-5 py-3 text-sm font-bold text-text-muted"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {application.workingDays?.length > 0 && (
            <Section title="Working Days">
              <div className="flex flex-wrap gap-2">
                {application.workingDays.map((day) => (
                  <span
                    key={day}
                    className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {application.scenarioQA && (
            <Section title="Scenario Answers">
              <AnswerCard
                label="Emergency during a job"
                value={application.scenarioQA.emergency}
              />

              <AnswerCard
                label="Difficult customer"
                value={application.scenarioQA.difficultCustomer}
              />
            </Section>
          )}

          {application.workBehaviorQA && (
            <Section title="Work Behavior Answers">
              <AnswerCard
                label="Punctuality"
                value={application.workBehaviorQA.punctuality}
              />

              <AnswerCard
                label="Safety"
                value={application.workBehaviorQA.safety}
              />
            </Section>
          )}
        </div>
      )}
    </article>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-background p-4 shadow-soft">
      <div className="mb-2 flex items-center gap-2 text-secondary">
        {icon}
        <p className="text-xs font-bold uppercase tracking-[0.12em]">{label}</p>
      </div>

      <p className="text-sm font-semibold leading-6 text-text">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-6 rounded-3xl border border-border-soft bg-background p-5 shadow-soft">
      <h3 className="mb-4 font-heading text-xl font-bold text-primary">
        {title}
      </h3>

      <div className="space-y-3">{children}</div>
    </div>
  );
}

function AnswerCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-card-gradient p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-secondary">
        {label}
      </p>

      <p className="mt-2 text-sm leading-6 text-text-muted">
        {value || "No answer provided."}
      </p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold uppercase tracking-[0.08em] text-primary">
        {label}
      </label>

      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border border-border-soft bg-card-gradient px-4 py-3 text-text outline-none transition disabled:bg-background-light disabled:text-text-muted focus:border-primary focus:ring-4 focus:ring-primary/10";

export default AdminApplications;
