import React from "react";
import { useNavigate } from "react-router-dom";

import Btn from "../../components/Btn";

// Icons
import GroupsIcon from "@mui/icons-material/Groups";
import HandymanIcon from "@mui/icons-material/Handyman";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const actors = [
  {
    icon: GroupsIcon,
    title: "Customers",
    description:
      "Browse services, book tasks, track requests, and review completed work.",
  },
  {
    icon: HandymanIcon,
    title: "Craftsmen",
    description:
      "Receive tasks, manage work, complete services, and grow reputation.",
  },
  {
    icon: AdminPanelSettingsIcon,
    title: "Admins",
    description:
      "Monitor operations, approve craftsmen, and maintain service quality.",
  },
];

const features = [
  {
    icon: VerifiedUserIcon,
    title: "Secure Registration",
    description:
      "Verified accounts and reviewed craftsmen applications ensure platform trust.",
  },
  {
    icon: LocationOnIcon,
    title: "Location-Based Booking",
    description:
      "Customers choose their service location for accurate task assignment.",
  },
  {
    icon: AssignmentTurnedInIcon,
    title: "Smart Assignment",
    description:
      "Tasks are distributed fairly using category matching and round robin logic.",
  },
  {
    icon: StarIcon,
    title: "Reviews & Ratings",
    description: "Track service quality through reviews and customer feedback.",
  },
];

const process = [
  "Customer posts a service request",
  "The system assigns the task",
  "Craftsman accepts the request",
  "Work gets completed professionally",
  "Customer reviews the service",
];

const goals = [
  "Simplify service booking",
  "Support craftsmen opportunities",
  "Ensure fair task assignment",
  "Improve service reliability",
  "Maintain platform quality",
];

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <main className="overflow-hidden bg-background-dark bg-hero-gradient">
      {/* HERO */}
      <section className="relative overflow-hidden bg-primary-gradient px-4 pb-24 pt-32 text-white sm:px-8 lg:px-16">
        <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-secondary/20 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-container text-center">
          <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary backdrop-blur-sm">
            About CraftConnect
          </p>

          <h1 className="mx-auto max-w-5xl font-heading text-4xl font-extrabold leading-tight sm:text-5xl lg:text-7xl">
            Connecting customers with trusted craftsmen
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            CraftConnect is a modern marketplace platform that helps customers
            easily book services while enabling craftsmen to manage and complete
            tasks efficiently.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Btn
              type="button"
              onClick={() => navigate("/services")}
              className="px-7"
            >
              Browse Services
              <ArrowForwardIcon fontSize="small" />
            </Btn>

            <Btn
              type="button"
              variant="outline"
              onClick={() => navigate("/how-it-works")}
              className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              How It Works
            </Btn>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="relative px-4 py-16 sm:px-8 lg:px-16">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-container gap-8 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-secondary/20 bg-secondary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
              Platform Overview
            </p>

            <h2 className="font-heading text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
              A complete service management platform
            </h2>

            <p className="mt-5 text-sm leading-7 text-text-muted sm:text-base">
              CraftConnect handles the entire service lifecycle from
              registration and booking to assignment, completion, and customer
              reviews.
            </p>

            <p className="mt-4 text-sm leading-7 text-text-muted sm:text-base">
              Customers can request services, craftsmen manage assigned work,
              and admins monitor the platform to ensure trust and quality.
            </p>
          </div>

          <div className="rounded-2xl border border-border-soft bg-card-gradient p-6 shadow-card sm:p-8">
            <h3 className="font-heading text-2xl font-bold text-primary">
              Platform Goals
            </h3>

            <div className="mt-6 space-y-4">
              {goals.map((goal) => (
                <div
                  key={goal}
                  className="flex items-start gap-3 rounded-2xl border border-border-soft bg-background p-4 shadow-soft"
                >
                  <CheckCircleIcon className="mt-0.5 text-secondary" />

                  <p className="font-medium leading-6 text-text">{goal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* USERS */}
      <section className="relative px-4 py-16 sm:px-8 lg:px-16">
        <div className="relative z-10 mx-auto max-w-container">
          <div className="mb-12 text-center">
            <p className="mb-4 inline-flex rounded-full border border-secondary/20 bg-secondary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
              Main Users
            </p>

            <h2 className="font-heading text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
              Built for every role
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
              Customers, craftsmen, and admins each play an important role in
              creating a trusted service ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {actors.map((actor) => {
              const Icon = actor.icon;

              return (
                <div
                  key={actor.title}
                  className="group rounded-2xl border border-border-soft bg-card-gradient p-6 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-card"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card transition duration-300 group-hover:scale-105">
                    <Icon fontSize="medium" />
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-primary">
                    {actor.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-text-muted">
                    {actor.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative px-4 py-16 sm:px-8 lg:px-16">
        <div className="relative z-10 mx-auto max-w-container">
          <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-secondary/20 bg-secondary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                Core Features
              </p>

              <h2 className="font-heading text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                Everything needed to manage services
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
                Built with booking, assignment, tracking, completion, and
                quality management features.
              </p>
            </div>

            <Btn
              type="button"
              variant="outline"
              onClick={() => navigate("/services")}
            >
              Explore Services
              <ArrowForwardIcon fontSize="small" />
            </Btn>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group flex gap-5 rounded-2xl border border-border-soft bg-card-gradient p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card transition duration-300 group-hover:scale-105">
                    <Icon fontSize="small" />
                  </div>

                  <div>
                    <h3 className="font-heading text-xl font-bold text-primary">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-text-muted">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="relative overflow-hidden bg-primary-gradient px-4 py-20 text-white sm:px-8 lg:px-16">
        <div className="absolute -right-28 top-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

        <div className="absolute -left-28 bottom-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-container gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
              System Process
            </p>

            <h2 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
              From booking to completion
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/80 sm:text-base">
              The platform handles service requests from start to finish while
              ensuring fairness, organization, and quality monitoring.
            </p>
          </div>

          <div className="space-y-4">
            {process.map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-sm transition hover:bg-white/15"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-gradient font-bold text-white shadow-card">
                  {index + 1}
                </div>

                <p className="pt-1 font-medium leading-6 text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative px-4 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-container">
          <div className="relative overflow-hidden rounded-3xl border border-border-soft bg-primary-gradient px-6 py-14 text-center text-white shadow-glass sm:px-10">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

            <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10">
              <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                Trust & Quality
              </p>

              <h2 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
                Start booking trusted services today
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                Find reliable craftsmen, manage tasks efficiently, and enjoy a
                modern service booking experience with CraftConnect.
              </p>

              <Btn
                type="button"
                onClick={() => navigate("/services")}
                className="mt-8 bg-secondary-gradient px-7 py-4 font-bold text-white shadow-card transition hover:scale-[1.02]"
              >
                Start Booking
                <ArrowForwardIcon fontSize="small" />
              </Btn>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
