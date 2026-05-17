import React from "react";
import { useNavigate } from "react-router-dom";

import Btn from "../../components/Btn";
// MUI Icons
import SearchIcon from "@mui/icons-material/Search";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HandymanIcon from "@mui/icons-material/Handyman";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const steps = [
  {
    icon: <SearchIcon fontSize="large" />,
    title: "Browse Services",
    description:
      "Explore service categories and choose the type of work you need, such as plumbing, cleaning, painting, or electrical work.",
  },
  {
    icon: <AssignmentTurnedInIcon fontSize="large" />,
    title: "Describe Your Task",
    description:
      "Tell us what you need done. Add a clear description so the craftsman understands your request before accepting the job.",
  },
  {
    icon: <LocationOnIcon fontSize="large" />,
    title: "Pick Your Location",
    description:
      "Select your location on the map so the craftsman can know where the service is needed.",
  },
  {
    icon: <HandymanIcon fontSize="large" />,
    title: "Get Matched",
    description:
      "CraftConnect assigns your task to an available craftsman based on the selected service and category.",
  },
  {
    icon: <StarIcon fontSize="large" />,
    title: "Review the Service",
    description:
      "After the task is completed, leave a rating and feedback to help maintain service quality.",
  },
];

const benefits = [
  "Easy service booking",
  "Location-based task requests",
  "Trusted craftsmen",
  "Simple task tracking",
  "Customer reviews",
  "Fast and clear process",
];

const HowItWorksPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="bg-primary text-white px-4 sm:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-accent-hover font-semibold mb-3">
            How CraftConnect Works
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold max-w-3xl mx-auto">
            Book trusted craftsmen in a few simple steps
          </h1>

          <p className="text-white/75 mt-4 max-w-2xl mx-auto">
            CraftConnect makes it easy to find the right professional, describe
            your task, select your location, and track your service request.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Btn
              type="button"
              onClick={() => navigate("/services")}
              variant="primary"
              className="rounded-full px-6 py-3 font-bold"
            >
              Browse Services
              <ArrowForwardIcon fontSize="small" />
            </Btn>

            <Btn
              type="button"
              onClick={() => navigate("/")}
              variant="outline"
              className="rounded-full px-6 py-3 font-bold border-white/25 text-white hover:bg-white/10 hover:text-white"
            >
              Back Home
            </Btn>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="px-4 sm:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary-light mb-2">
              Simple Process
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
              From request to completion
            </h2>

            <p className="text-text-muted mt-3 max-w-2xl mx-auto">
              Follow these steps to book and manage your service request.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-3xl bg-white border border-gray-100 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
                  {step.icon}
                </div>

                <div className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-bg text-sm font-bold text-primary">
                  {index + 1}
                </div>

                <h3 className="text-lg font-bold text-primary mb-3">
                  {step.title}
                </h3>

                <p className="text-sm leading-6 text-text-muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Flow */}
      <section className="bg-white px-4 sm:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-semibold text-primary-light mb-2">
              Customer Journey
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
              Everything starts with choosing a service
            </h2>

            <p className="text-text-muted mt-4 leading-7">
              Customers browse available services, choose a category, describe
              the work, and select their location using the map. Once submitted,
              the task can be assigned to a suitable craftsman.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 rounded-2xl bg-bg px-4 py-3"
                >
                  <CheckCircleIcon className="text-accent" />
                  <p className="font-semibold text-primary">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-bg border border-gray-100 p-6 sm:p-8">
            <div className="rounded-2xl bg-white p-5 shadow-sm mb-4">
              <p className="text-sm text-text-muted">Step 1</p>
              <h3 className="text-xl font-bold text-primary mt-1">
                Select a service
              </h3>
              <p className="text-text-muted mt-2">
                Pick the service you need from the available categories.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm mb-4">
              <p className="text-sm text-text-muted">Step 2</p>
              <h3 className="text-xl font-bold text-primary mt-1">
                Add task details
              </h3>
              <p className="text-text-muted mt-2">
                Write a description and explain what needs to be done.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-text-muted">Step 3</p>
              <h3 className="text-xl font-bold text-primary mt-1">
                Choose your location
              </h3>
              <p className="text-text-muted mt-2">
                Click on the map or use your current location before booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-8 lg:px-16 py-16">
        <div className="max-w-5xl mx-auto rounded-3xl bg-primary px-6 sm:px-10 py-12 text-center text-white">
          <p className="text-accent-hover font-semibold mb-3">
            Ready to start?
          </p>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Find the right craftsman for your next task
          </h2>

          <p className="text-white/75 mt-4 max-w-2xl mx-auto">
            Browse services, choose what you need, and book a trusted
            professional through CraftConnect.
          </p>

          <Btn
            type="button"
            onClick={() => navigate("/services")}
            variant="primary"
            className="mt-8 rounded-xl px-7 py-3 font-bold"
          >
            Browse Services
            <ArrowForwardIcon fontSize="small" />
          </Btn>
        </div>
      </section>
    </main>
  );
};

export default HowItWorksPage;
