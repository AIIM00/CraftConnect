import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../../context/AppContext";

// Components
import LocationPicker from "../../components/LocationPicker";
import Btn from "../../components/Btn";

// MUI Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const CraftsmanApplication = () => {
  const { backendUrl, getUserData } = React.useContext(AppContext);
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [step, setStep] = React.useState(1);

  const [formData, setFormData] = React.useState({
    categoryId: "",
    serviceId: "",
    customCategory: "",
    customService: "",
    yearsOfExperience: "",
    city: "",
    address1: "",
    apartment: "",
    workingDays: [],
    workingHours: {
      from: "",
      to: "",
    },
    maxTravelDistance: "",
    scenarioQA: {
      emergency: "",
      difficultCustomer: "",
    },
    workBehaviorQA: {
      punctuality: "",
      safety: "",
    },
  });

  const [categories, setCategories] = React.useState([]);
  const [selectedLocation, setSelectedLocation] = React.useState(null);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const getApplication = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/craftsman/applications/me`,
        { withCredentials: true },
      );

      const application = data.application;

      if (application?.status === "SUBMITTED") {
        navigate("/craftsman/pending-approval", { replace: true });
        return;
      }

      if (application) {
        setStep(application.step || 1);

        setFormData((prev) => ({
          ...prev,
          categoryId: application.categoryId || "",
          serviceId: application.serviceId || "",
          customCategory: application.customCategory || "",
          customService: application.customService || "",
          yearsOfExperience: application.yearsOfExperience || "",
          city: application.city || "",
          address1: application.address1 || "",
          apartment: application.apartment || "",
          workingDays: application.workingDays || [],
          workingHours: application.workingHours || {
            from: "",
            to: "",
          },
          maxTravelDistance: application.maxTravelDistance || "",
          scenarioQA: application.scenarioQA || {
            emergency: "",
            difficultCustomer: "",
          },
          workBehaviorQA: application.workBehaviorQA || {
            punctuality: "",
            safety: "",
          },
        }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load application");
    } finally {
      setLoading(false);
    }
  };

  const getCategoriesAndServices = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/craftsman/categories-services`,
        { withCredentials: true },
      );

      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getApplication();
    getCategoriesAndServices();
  }, []);

  const selectedCategory = categories.find(
    (category) => category.id === formData.categoryId,
  );

  const filteredServices = selectedCategory ? selectedCategory.services : [];

  const saveStep = async (nextStep = step) => {
    try {
      const payload = {
        step: nextStep,
        data: {},
      };

      if (step === 1) {
        payload.data = {
          categoryId:
            formData.categoryId === "other"
              ? null
              : formData.categoryId || null,
          serviceId:
            formData.serviceId === "other" ? null : formData.serviceId || null,
          customCategory:
            formData.categoryId === "other"
              ? formData.customCategory || null
              : null,
          customService:
            formData.serviceId === "other"
              ? formData.customService || null
              : null,
          yearsOfExperience: Number(formData.yearsOfExperience),
        };
      }

      if (step === 2) {
        payload.data = {
          city: formData.city,
          address1: formData.address1,
          apartment: formData.apartment,
        };
      }

      if (step === 3) {
        payload.data = {
          workingDays: formData.workingDays,
          workingHours: formData.workingHours,
          maxTravelDistance: Number(formData.maxTravelDistance),
        };
      }

      if (step === 4) {
        payload.data = {
          scenarioQA: formData.scenarioQA,
          workBehaviorQA: formData.workBehaviorQA,
        };
      }

      await axios.post(
        `${backendUrl}/api/craftsman/applications/save`,
        payload,
        { withCredentials: true },
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save step");
      throw err;
    }
  };

  const next = async () => {
    await saveStep(step + 1);
    setStep((prev) => prev + 1);
  };

  const back = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const submitApplication = async () => {
    try {
      setSubmitting(true);

      await saveStep(4);

      const { data } = await axios.post(
        `${backendUrl}/api/craftsman/applications/submit`,
        {},
        { withCredentials: true },
      );

      toast.success(data.message || "Application submitted successfully");

      await getUserData();

      navigate("/craftsman/pending-approval", { replace: true });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to submit application",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDay = (day) => {
    setFormData((prev) => {
      const exists = prev.workingDays.includes(day);

      return {
        ...prev,
        workingDays: exists
          ? prev.workingDays.filter((item) => item !== day)
          : [...prev.workingDays, day],
      };
    });
  };

  const updateWorkingHours = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [key]: value,
      },
    }));
  };

  const isStepValid = () => {
    if (step === 1) {
      const categoryValid =
        formData.categoryId &&
        (formData.categoryId !== "other" || formData.customCategory?.trim());

      const serviceValid =
        formData.serviceId &&
        (formData.serviceId !== "other" || formData.customService?.trim());

      return categoryValid && serviceValid && formData.yearsOfExperience !== "";
    }

    if (step === 2) {
      return (
        selectedLocation &&
        formData.city.trim() &&
        formData.address1.trim() &&
        formData.apartment.trim()
      );
    }

    if (step === 3) {
      return (
        formData.workingDays.length > 0 &&
        formData.workingHours.from &&
        formData.workingHours.to &&
        Number(formData.maxTravelDistance) > 0
      );
    }

    if (step === 4) {
      return (
        formData.scenarioQA.emergency.trim() &&
        formData.scenarioQA.difficultCustomer.trim() &&
        formData.workBehaviorQA.punctuality.trim() &&
        formData.workBehaviorQA.safety.trim()
      );
    }

    return false;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background-dark bg-hero-gradient px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center">
          <div className="w-full rounded-3xl border border-border-soft bg-card-gradient p-8 text-center shadow-card">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
              <ConstructionOutlinedIcon />
            </div>

            <h1 className="font-heading text-2xl font-bold text-primary">
              Loading Application
            </h1>

            <p className="mt-2 text-sm text-text-muted">
              Please wait while we load your application.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background-dark bg-hero-gradient px-4 py-10 text-text sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-border-soft bg-card-gradient shadow-card">
        <div className="relative overflow-hidden bg-primary-gradient px-6 py-8 text-white sm:px-8 lg:px-10">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />

          <div className="relative z-10">
            <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
              Craftsman Registration
            </p>

            <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
              Become a Craftsman
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Complete your application to start receiving jobs and grow your
              professional profile on CraftConnect.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-8 lg:p-10">
          <div className="mb-10">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-primary">
                  Application Progress
                </p>

                <h2 className="mt-1 font-heading text-2xl font-bold text-primary">
                  Step {step} of 4
                </h2>
              </div>

              <div className="rounded-2xl border border-secondary/20 bg-secondary/10 px-4 py-2 text-sm font-bold text-secondary">
                {Math.round((step / 4) * 100)}%
              </div>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full bg-primary-gradient transition-all duration-500"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {step === 1 && (
            <StepCard
              icon={<ConstructionOutlinedIcon />}
              title="Professional Information"
              description="Choose your category, service, and experience level."
            >
              <Field label="Category">
                <select
                  required
                  value={formData.categoryId}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: event.target.value,
                      customCategory: "",
                      serviceId: "",
                    }))
                  }
                  className={inputClass}
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}

                  <option value="other">Other</option>
                </select>
              </Field>

              {formData.categoryId === "other" && (
                <Field label="Custom Category">
                  <input
                    required
                    type="text"
                    placeholder="Enter your category"
                    value={formData.customCategory || ""}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        customCategory: event.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </Field>
              )}

              <Field label="Service">
                <select
                  required
                  value={formData.serviceId}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      serviceId: event.target.value,
                      customService: "",
                    }))
                  }
                  className={inputClass}
                >
                  <option value="">Select service</option>

                  {filteredServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}

                  <option value="other">Other</option>
                </select>
              </Field>

              {formData.serviceId === "other" && (
                <Field label="Custom Service">
                  <input
                    required
                    type="text"
                    placeholder="Enter your service"
                    value={formData.customService || ""}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        customService: event.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </Field>
              )}

              <Field label="Years of Experience">
                <input
                  required
                  type="number"
                  min="0"
                  value={formData.yearsOfExperience}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      yearsOfExperience: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>
            </StepCard>
          )}

          {step === 2 && (
            <StepCard
              icon={<LocationOnIcon />}
              title="Location Information"
              description="Choose your service location and complete your address."
            >
              <section className="rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-soft">
                <label className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-primary">
                  <LocationOnIcon fontSize="small" />
                  Select your location
                </label>

                <div className="overflow-hidden rounded-3xl border border-border-soft shadow-soft">
                  <LocationPicker
                    value={selectedLocation}
                    onChange={(location) => {
                      setSelectedLocation(location);

                      setFormData((prev) => ({
                        ...prev,
                        city: location?.city || "",
                        address1: location?.locationName || "",
                      }));
                    }}
                    defaultCenter={[34.436, 35.835]}
                    zoom={13}
                    height="350px"
                  />
                </div>

                {selectedLocation && (
                  <div className="mt-5 rounded-2xl border border-success/20 bg-success/10 p-4 text-sm text-success">
                    <p className="font-bold">Location selected</p>

                    <p className="mt-1 leading-6">
                      {selectedLocation.location ||
                        selectedLocation.locationName ||
                        selectedLocation.address ||
                        "Your selected map location is ready."}
                    </p>
                  </div>
                )}
              </section>

              <Field label="Apartment / Floor / Building">
                <input
                  value={formData.apartment}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      apartment: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>
            </StepCard>
          )}

          {step === 3 && (
            <StepCard
              icon={<ScheduleIcon />}
              title="Availability"
              description="Tell us when you can work and how far you can travel."
            >
              <div>
                <label className="mb-3 block text-sm font-bold uppercase tracking-[0.08em] text-primary">
                  Working Days
                </label>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {days.map((day) => {
                    const selected = formData.workingDays.includes(day);

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                          selected
                            ? "border-transparent bg-primary-gradient text-white shadow-card"
                            : "border-border-soft bg-card-gradient text-text hover:border-primary/20 hover:bg-background-light"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="From">
                  <input
                    type="time"
                    value={formData.workingHours?.from || ""}
                    onChange={(event) =>
                      updateWorkingHours("from", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="To">
                  <input
                    type="time"
                    value={formData.workingHours?.to || ""}
                    onChange={(event) =>
                      updateWorkingHours("to", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Max Travel Distance, in km">
                <input
                  type="number"
                  min="1"
                  value={formData.maxTravelDistance}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxTravelDistance: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>
            </StepCard>
          )}

          {step === 4 && (
            <StepCard
              icon={<QuestionAnswerIcon />}
              title="Application Questions"
              description="Answer a few questions to help admins review your application."
            >
              <Field label="What would you do in an emergency during a job?">
                <textarea
                  value={formData.scenarioQA.emergency}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      scenarioQA: {
                        ...prev.scenarioQA,
                        emergency: event.target.value,
                      },
                    }))
                  }
                  className={textareaClass}
                />
              </Field>

              <Field label="How do you handle a difficult customer?">
                <textarea
                  value={formData.scenarioQA.difficultCustomer}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      scenarioQA: {
                        ...prev.scenarioQA,
                        difficultCustomer: event.target.value,
                      },
                    }))
                  }
                  className={textareaClass}
                />
              </Field>

              <Field label="How important is punctuality to you?">
                <textarea
                  value={formData.workBehaviorQA.punctuality}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      workBehaviorQA: {
                        ...prev.workBehaviorQA,
                        punctuality: event.target.value,
                      },
                    }))
                  }
                  className={textareaClass}
                />
              </Field>

              <Field label="How do you make sure your work is safe?">
                <textarea
                  value={formData.workBehaviorQA.safety}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      workBehaviorQA: {
                        ...prev.workBehaviorQA,
                        safety: event.target.value,
                      },
                    }))
                  }
                  className={textareaClass}
                />
              </Field>
            </StepCard>
          )}

          <div className="mt-10 flex flex-col-reverse gap-4 border-t border-border-soft pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Btn
              type="button"
              onClick={back}
              disabled={step === 1}
              variant="outline"
              className="rounded-xl"
            >
              Back
            </Btn>

            {step < 4 ? (
              <Btn
                type="button"
                onClick={next}
                disabled={!isStepValid()}
                variant="primary"
                className="rounded-xl"
              >
                Save and Continue
              </Btn>
            ) : (
              <Btn
                type="button"
                onClick={submitApplication}
                disabled={submitting || !isStepValid()}
                variant="primary"
                className="rounded-xl"
              >
                <CheckCircleIcon fontSize="small" />
                {submitting ? "Submitting..." : "Submit Application"}
              </Btn>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

const inputClass =
  "w-full rounded-xl border border-border-soft bg-dark px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";

const textareaClass =
  "min-h-[140px] w-full rounded-2xl border border-border-soft bg-card-gradient px-4 py-4 text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";

function StepCard({ icon, title, description, children }) {
  return (
    <section className="rounded-3xl border border-border-soft bg-background p-5 shadow-soft sm:p-6">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
          {icon}
        </div>

        <div>
          <h2 className="font-heading text-2xl font-bold text-primary">
            {title}
          </h2>

          <p className="mt-2 text-sm leading-7 text-text-muted">
            {description}
          </p>
        </div>
      </div>

      <div className="space-y-5">{children}</div>
    </section>
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

export default CraftsmanApplication;
