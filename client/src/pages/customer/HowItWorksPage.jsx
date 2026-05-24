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
import HomeIcon from "@mui/icons-material/Home";

const steps = [
  {
    icon: <SearchIcon fontSize="large" />,
    title: "Browse Services",
    description:
      "Explore service categories and choose the type of work you need.",
  },
  {
    icon: <AssignmentTurnedInIcon fontSize="large" />,
    title: "Describe Your Task",
    description: "Add clear details so the craftsman understands your request.",
  },
  {
    icon: <LocationOnIcon fontSize="large" />,
    title: "Pick Your Location",
    description:
      "Choose your location on the map before confirming the booking.",
  },
  {
    icon: <HandymanIcon fontSize="large" />,
    title: "Get Matched",
    description: "CraftConnect assigns your request to an available craftsman.",
  },
  {
    icon: <StarIcon fontSize="large" />,
    title: "Review the Service",
    description: "Rate the completed work and help improve service quality.",
  },
];

const benefits = [
  "Easy service booking",
  "Location-based requests",
  "Trusted craftsmen",
  "Simple task tracking",
  "Customer reviews",
  "Fast process",
];

const journeyCards = [
  {
    step: "Step 1",
    title: "Select a service",
    description: "Choose the service category you need.",
  },
  {
    step: "Step 2",
    title: "Describe the task",
    description: "Explain the problem or work required.",
  },
  {
    step: "Step 3",
    title: "Choose your location",
    description: "Select your service location before booking.",
  },
];

const HowItWorksPage = () => {
  const navigate = useNavigate();

  return (
    <main className="w-full overflow-hidden bg-background-dark bg-hero-gradient">
      {/* HERO */}
      <section className="relative overflow-hidden bg-primary-gradient px-4 pb-20 pt-32 text-white sm:px-8 lg:px-16">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-secondary/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-container text-center">
          <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary backdrop-blur-sm">
            How CraftConnect Works
          </p>

          <h1 className="mx-auto max-w-5xl font-heading text-4xl font-extrabold leading-tight sm:text-5xl lg:text-7xl">
            Book trusted craftsmen in a few simple steps
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            Find the right service, describe your task, choose your location,
            and track everything from one place.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Btn
              type="button"
              onClick={() => navigate("/services")}
              variant="secondary"
              className="px-7"
            >
              Browse Services
              <ArrowForwardIcon fontSize="small" />
            </Btn>

            <Btn
              type="button"
              onClick={() => navigate("/")}
              variant="outline"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <HomeIcon fontSize="small" />
              Back Home
            </Btn>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-8 lg:px-16">
        <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-container">
          <div className="mb-12 text-center">
            <p className="mb-4 inline-flex rounded-full border border-secondary/20 bg-secondary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
              Simple Process
            </p>

            <h2 className="font-heading text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
              From request to completion
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
              Follow these simple steps to request and manage your service.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="group relative overflow-hidden rounded-3xl border border-border-soft bg-card-gradient p-6 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-card"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />

                <div className="pointer-events-none absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-secondary/20 blur-2xl" />

                <div className="relative z-10">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card transition-all duration-300 group-hover:scale-105">
                    {step.icon}
                  </div>

                  <div className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-secondary-gradient text-sm font-bold text-white shadow-card">
                    {index + 1}
                  </div>

                  <h3 className="mb-3 font-heading text-xl font-bold text-primary">
                    {step.title}
                  </h3>

                  <p className="text-sm leading-7 text-text-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMER FLOW */}
      <section className="relative overflow-hidden bg-primary-gradient px-4 py-20 text-white sm:px-8 lg:px-16">
        <div className="pointer-events-none absolute -right-28 top-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

        <div className="pointer-events-none absolute -left-28 bottom-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-container grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
              Customer Journey
            </p>

            <h2 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
              Everything starts with choosing a service
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/80 sm:text-base">
              Customers browse services, explain their task, select a location,
              and wait for a suitable craftsman to accept the request.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm transition hover:bg-white/15"
                >
                  <CheckCircleIcon className="text-secondary" />

                  <p className="font-semibold text-white">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-glass backdrop-blur-sm sm:p-8">
            {journeyCards.map((item, index) => (
              <div
                key={item.step}
                className="rounded-2xl border border-white/10 bg-white/10 p-5 transition hover:bg-white/15"
              >
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-secondary">
                  {item.step}
                </p>

                <h3 className="mt-2 font-heading text-2xl font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/75">
                  {item.description}
                </p>

                {index !== journeyCards.length - 1 && (
                  <div className="mt-5 h-px w-full bg-white/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-container">
          <div className="relative overflow-hidden rounded-3xl border border-border-soft bg-primary-gradient px-6 py-14 text-center text-white shadow-glass sm:px-10">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

            <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10">
              <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                Ready To Start?
              </p>

              <h2 className="mx-auto max-w-4xl font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
                Find the right craftsman for your next task
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                Browse services, choose what you need, and book trusted
                professionals through CraftConnect.
              </p>

              <Btn
                type="button"
                onClick={() => navigate("/services")}
                variant="secondary"
                className="mt-8 px-7"
              >
                Browse Services
                <ArrowForwardIcon fontSize="small" />
              </Btn>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HowItWorksPage;
