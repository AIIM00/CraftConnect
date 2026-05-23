import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

// Components
import LocationPicker from "../../components/LocationPicker";
import Btn from "../../components/Btn";
//MUI Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";

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

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [categories, setCategories] = React.useState([]);
  const [selectedLocation, setSelectedLocation] = React.useState(null);

  const getApplication = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/craftsman/applications/me`,
        {
          withCredentials: true,
        },
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

  React.useEffect(() => {
    getApplication();
    getCategoriesAndServices();
  }, []);

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
        {
          withCredentials: true,
        },
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

  const getCategoriesAndServices = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/craftsman/categories-services`,
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const selectedCategory = categories.find(
    (category) => category.id === formData.categoryId,
  );

  const filteredServices = selectedCategory ? selectedCategory.services : [];
  const submitApplication = async () => {
    try {
      setSubmitting(true);

      await saveStep(4);

      const { data } = await axios.post(
        `${backendUrl}/api/craftsman/applications/submit`,
        {},
        {
          withCredentials: true,
        },
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-text">
        Loading application...
      </div>
    );
  }

  const isStepValid = () => {
    // STEP 1
    if (step === 1) {
      const categoryValid =
        formData.categoryId &&
        (formData.categoryId !== "other" || formData.customCategory?.trim());

      const serviceValid =
        formData.serviceId &&
        (formData.serviceId !== "other" || formData.customService?.trim());

      return categoryValid && serviceValid && formData.yearsOfExperience !== "";
    }

    // STEP 2
    if (step === 2) {
      return (
        selectedLocation &&
        formData.city.trim() &&
        formData.address1.trim() &&
        formData.apartment.trim()
      );
    }

    // STEP 3
    if (step === 3) {
      return (
        formData.workingDays.length > 0 &&
        formData.workingHours.from &&
        formData.workingHours.to &&
        Number(formData.maxTravelDistance) > 0
      );
    }

    // STEP 4
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
  return (
    <div className="min-h-screen bg-bg px-4 py-10 text-text">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold text-primary mb-2">
          Craftsman Application
        </h1>

        <p className="text-text-muted mb-8">
          Complete your application before you can start receiving work.
        </p>

        <div className="mb-8">
          <p className="font-bold text-sm text-text-muted">Step {step} of 4</p>
          <div className="mt-2 h-2 rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-primary transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold">Professional Information</h2>

            <div>
              <label className="block font-semibold mb-2">Category</label>

              <select
                required
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: e.target.value,
                    customCategory: "",
                    serviceId: "",
                  }))
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
              >
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}

                <option value="other">Other</option>
              </select>

              {formData.categoryId === "other" && (
                <input
                  required
                  type="text"
                  placeholder="Enter your category"
                  value={formData.customCategory || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customCategory: e.target.value,
                    }))
                  }
                  className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                />
              )}
            </div>

            {/* SERVICE */}
            <div>
              <label className="block font-semibold mb-2">Service</label>

              <select
                required
                value={formData.serviceId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    serviceId: e.target.value,
                    customService: "",
                  }))
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
              >
                <option value="">Select service</option>

                {filteredServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}

                <option value="other">Other</option>
              </select>

              {formData.serviceId === "other" && (
                <input
                  required
                  type="text"
                  placeholder="Enter your service"
                  value={formData.customService || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customService: e.target.value,
                    }))
                  }
                  className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                />
              )}
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Years of Experience
              </label>
              <input
                required
                type="number"
                min="0"
                value={formData.yearsOfExperience}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    yearsOfExperience: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold">Location Information</h2>

            <div>
              <div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/55 p-8 shadow-sm backdrop-blur-md">
                <label className="mb-3 flex items-center gap-2 text-sm font-extrabold text-primary">
                  <LocationOnIcon fontSize="small" />
                  Select your location
                </label>

                <div className="overflow-hidden rounded-[22px] border border-primary/10">
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
                  <div className="mt-4 rounded-[20px] border border-success/20 bg-success/10 p-4 text-sm text-success">
                    <p className="font-extrabold">Location selected</p>
                    <p className="mt-1 leading-6">
                      {selectedLocation.location ||
                        selectedLocation.locationName ||
                        selectedLocation.address ||
                        "Your selected map location is ready."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">Apartment</label>
              <input
                value={formData.apartment}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    apartment: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold">Availability</h2>

            <div>
              <label className="block font-semibold mb-3">Working Days</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {days.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`rounded-xl border px-4 py-3 font-semibold ${
                      formData.workingDays.includes(day)
                        ? "border-primary bg-primary text-white"
                        : "border-gray-200 bg-white text-text"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">From</label>
                <input
                  type="time"
                  value={formData.workingHours?.from || ""}
                  onChange={(e) => updateWorkingHours("from", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">To</label>
                <input
                  type="time"
                  value={formData.workingHours?.to || ""}
                  onChange={(e) => updateWorkingHours("to", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Max Travel Distance, in km
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxTravelDistance}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxTravelDistance: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
              />
            </div>
          </div>
        )}
        {console.log("formdata:", formData)}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold">Application Questions</h2>

            <div>
              <label className="block font-semibold mb-2">
                What would you do in an emergency during a job?
              </label>
              <textarea
                value={formData.scenarioQA.emergency}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    scenarioQA: {
                      ...prev.scenarioQA,
                      emergency: e.target.value,
                    },
                  }))
                }
                className="w-full min-h-28 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                How do you handle a difficult customer?
              </label>
              <textarea
                value={formData.scenarioQA.difficultCustomer}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    scenarioQA: {
                      ...prev.scenarioQA,
                      difficultCustomer: e.target.value,
                    },
                  }))
                }
                className="w-full min-h-28 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                How important is punctuality to you?
              </label>
              <textarea
                value={formData.workBehaviorQA.punctuality}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    workBehaviorQA: {
                      ...prev.workBehaviorQA,
                      punctuality: e.target.value,
                    },
                  }))
                }
                className="w-full min-h-28 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                How do you make sure your work is safe?
              </label>
              <textarea
                value={formData.workBehaviorQA.safety}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    workBehaviorQA: {
                      ...prev.workBehaviorQA,
                      safety: e.target.value,
                    },
                  }))
                }
                className="w-full min-h-28 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
              />
            </div>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between gap-4">
          <Btn
            type="button"
            onClick={back}
            disabled={step === 1}
            variant="outline"
          >
            Back
          </Btn>

          {step < 4 ? (
            <Btn
              type="button"
              onClick={next}
              disabled={!isStepValid()}
              variant="primary"
              className=""
            >
              Save and Continue
            </Btn>
          ) : (
            <Btn
              type="button"
              onClick={submitApplication}
              disabled={submitting || !isStepValid()}
              variant="primary"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
};

export default CraftsmanApplication;
