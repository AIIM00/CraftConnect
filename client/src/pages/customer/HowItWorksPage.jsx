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

const journeyCards = [
  {
    step: "Step 1",
    title: "Select a service",
    description: "Pick the service you need from the available categories.",
  },
  {
    step: "Step 2",
    title: "Add task details",
    description: "Write a description and explain what needs to be done.",
  },
  {
    step: "Step 3",
    title: "Choose your location",
    description:
      "Click on the map or use your current location before booking.",
  },
];

const HowItWorksPage = () => {
  const navigate = useNavigate();

  return (
    <main className="w-full bg-bg">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-32 text-text-light sm:px-8 lg:px-16 bg-[radial-gradient(circle_at_72%_18%,rgba(218,165,32,0.28),transparent_28%),radial-gradient(circle_at_18%_84%,rgba(0,128,128,0.26),transparent_30%),linear-gradient(135deg,#133A63_0%,#0B2540_48%,#008080_100%)]">
        <div className="pointer-events-none absolute -right-32 -top-36 h-[540px] w-[540px] rotate-[26deg] rounded-[42%] bg-[linear-gradient(135deg,rgba(169,209,232,0.55),rgba(218,165,32,0.24),rgba(255,255,255,0.12))] opacity-65" />
        <div className="pointer-events-none absolute -bottom-44 -left-36 h-[540px] w-[540px] rotate-[-24deg] rounded-[42%] bg-[linear-gradient(135deg,rgba(0,128,128,0.5),rgba(169,209,232,0.25),rgba(255,255,255,0.12))] opacity-65" />

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 font-body text-xs font-semibold tracking-[0.18em] text-accent-soft backdrop-blur-md">
            HOW CRAFTCONNECT WORKS
          </p>

          <h1 className="mx-auto max-w-4xl font-heading text-[clamp(2.4rem,6vw,5rem)] font-extrabold leading-tight tracking-[1px] text-text-light [text-shadow:0_0_18px_rgba(218,165,32,0.28)]">
            Book trusted craftsmen in a few simple steps
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[rgba(247,244,237,0.76)] sm:text-base">
            CraftConnect makes it easy to find the right professional, describe
            your task, select your location, and track your service request.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Btn
              type="button"
              onClick={() => navigate("/services")}
              variant="ghost"
              className="rounded-full border border-[rgba(247,244,237,0.55)] bg-gold-gradient px-7 py-3 font-extrabold text-primary-dark shadow-[0_12px_26px_rgba(218,165,32,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(218,165,32,0.36)]"
            >
              Browse Services
              <ArrowForwardIcon fontSize="small" />
            </Btn>

            <Btn
              type="button"
              onClick={() => navigate("/")}
              variant="ghost"
              className="rounded-full border border-white/20 bg-white/10 px-7 py-3 font-extrabold text-text-light shadow-none backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20 hover:text-accent-soft"
            >
              <HomeIcon fontSize="small" />
              Back Home
            </Btn>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F7F4ED_0%,#EAE3D4_55%,rgba(169,209,232,0.45)_100%)] px-4 py-16 sm:px-8 lg:px-16">
        <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 inline-flex rounded-full border border-primary/10 bg-white/45 px-4 py-2 font-body text-xs font-bold tracking-[0.18em] text-primary shadow-soft backdrop-blur-md">
              SIMPLE PROCESS
            </p>

            <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-[1px] text-primary">
              From request to completion
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
              Follow these steps to book and manage your service request.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-white/55 p-6 shadow-[0_18px_45px_rgba(19,58,99,0.12),inset_0_0_35px_rgba(255,255,255,0.45)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-accent/40 hover:bg-white/75 hover:shadow-[0_25px_60px_rgba(19,58,99,0.18)]"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-accent/20 blur-2xl transition group-hover:bg-accent/30" />
                <div className="pointer-events-none absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-teal/15 blur-2xl" />

                <div className="relative z-10">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(247,244,237,0.65)] bg-[linear-gradient(135deg,#A9D1E8_0%,#DAA520_100%)] text-primary-dark shadow-[0_0_28px_rgba(218,165,32,0.28)] transition-all duration-300 group-hover:scale-110">
                    {step.icon}
                  </div>

                  <div className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-primary/10 bg-white/65 text-sm font-extrabold text-primary shadow-soft backdrop-blur-md">
                    {index + 1}
                  </div>

                  <h3 className="mb-3 font-display text-lg font-extrabold text-primary">
                    {step.title}
                  </h3>

                  <p className="text-sm leading-6 text-text-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Flow */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F7F4ED_0%,#EAE3D4_52%,rgba(169,209,232,0.5)_100%)] px-4 py-16 sm:px-8 lg:px-16">
        <div className="pointer-events-none absolute -right-28 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-28 bottom-10 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-primary/10 bg-white/45 px-4 py-2 font-body text-xs font-bold tracking-[0.18em] text-primary shadow-soft backdrop-blur-md">
              CUSTOMER JOURNEY
            </p>

            <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight tracking-[1px] text-primary">
              Everything starts with choosing a service
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
              Customers browse available services, choose a category, describe
              the work, and select their location using the map. Once submitted,
              the task can be assigned to a suitable craftsman.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 rounded-[20px] border border-white/60 bg-white/55 px-4 py-3 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/75"
                >
                  <CheckCircleIcon className="text-accent" />
                  <p className="font-semibold text-primary">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/60 bg-white/55 p-6 shadow-[0_25px_70px_rgba(19,58,99,0.14),inset_0_0_35px_rgba(255,255,255,0.45)] backdrop-blur-xl sm:p-8">
            {journeyCards.map((item, index) => (
              <div
                key={item.step}
                className={`rounded-[24px] border border-white/60 bg-white/55 p-5 shadow-sm backdrop-blur-md ${
                  index !== journeyCards.length - 1 ? "mb-4" : ""
                }`}
              >
                <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-text-muted">
                  {item.step}
                </p>

                <h3 className="mt-1 font-heading text-xl font-extrabold text-primary">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F7F4ED_0%,#EAE3D4_55%,rgba(169,209,232,0.45)_100%)] px-4 py-16 sm:px-8 lg:px-16">
        <div className="relative z-10 mx-auto max-w-5xl overflow-hidden rounded-[36px] border border-white/40 bg-[radial-gradient(circle_at_80%_10%,rgba(218,165,32,0.26),transparent_28%),radial-gradient(circle_at_10%_90%,rgba(0,128,128,0.25),transparent_32%),linear-gradient(135deg,#133A63_0%,#0B2540_58%,#008080_100%)] px-6 py-12 text-center text-text-light shadow-[0_25px_70px_rgba(19,58,99,0.22),inset_0_0_45px_rgba(255,255,255,0.06)] backdrop-blur-xl sm:px-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-teal/25 blur-3xl" />

          <div className="relative z-10">
            <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.18em] text-accent-soft backdrop-blur-md">
              READY TO START?
            </p>

            <h2 className="mx-auto max-w-3xl font-heading text-[clamp(2rem,5vw,3.6rem)] font-extrabold leading-tight tracking-[1px] text-text-light [text-shadow:0_0_18px_rgba(218,165,32,0.28)]">
              Find the right craftsman for your next task
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[rgba(247,244,237,0.76)] sm:text-base">
              Browse services, choose what you need, and book a trusted
              professional through CraftConnect.
            </p>

            <Btn
              type="button"
              onClick={() => navigate("/customer/services")}
              variant="ghost"
              className="mt-8 rounded-full border border-[rgba(247,244,237,0.55)] bg-gold-gradient px-7 py-3 font-extrabold text-primary-dark shadow-[0_12px_26px_rgba(218,165,32,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(218,165,32,0.36)]"
            >
              Browse Services
              <ArrowForwardIcon fontSize="small" />
            </Btn>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HowItWorksPage;
