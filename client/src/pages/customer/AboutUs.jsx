import React from "react";
import { useNavigate } from "react-router-dom";
import Btn from "../../components/Btn";

// MUI Icons
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
    icon: <GroupsIcon fontSize="large" />,
    title: "Customers",
    description:
      "Customers can browse services, book tasks, choose their location, track requests, and leave reviews after completion.",
  },
  {
    icon: <HandymanIcon fontSize="large" />,
    title: "Craftsmen",
    description:
      "Craftsmen receive assigned tasks, accept or decline requests, complete jobs, upload proof of work, and manage their profiles.",
  },
  {
    icon: <AdminPanelSettingsIcon fontSize="large" />,
    title: "Admins",
    description:
      "Admins monitor the platform, approve craftsmen, manage users, review performance, and keep the system reliable.",
  },
];

const features = [
  {
    icon: <VerifiedUserIcon />,
    title: "Secure Registration",
    description:
      "Users register with email verification, while craftsmen applications are reviewed before approval.",
  },
  {
    icon: <LocationOnIcon />,
    title: "Location-Based Booking",
    description:
      "Customers choose their service location so tasks can be handled by suitable craftsmen.",
  },
  {
    icon: <AssignmentTurnedInIcon />,
    title: "Smart Task Assignment",
    description:
      "The system assigns service requests to available craftsmen using category matching and round robin assignment.",
  },
  {
    icon: <StarIcon />,
    title: "Reviews & Quality Control",
    description:
      "Customers can review completed services, and admins can monitor craftsman performance.",
  },
];

const process = [
  "Customer browses available services",
  "Customer books a task and selects a location",
  "System assigns the task to a suitable craftsman",
  "Craftsman accepts and completes the task",
  "Customer tracks progress and leaves a review",
  "Admin monitors quality and manages the platform",
];

const goals = [
  "Make service booking simple for customers",
  "Help craftsmen find and manage work",
  "Assign tasks fairly using round robin logic",
  "Allow admins to monitor quality and performance",
  "Support reviews, warnings, and account management",
];

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <main className="w-full bg-bg">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-32 text-text-light sm:px-8 lg:px-16 bg-[radial-gradient(circle_at_72%_18%,rgba(218,165,32,0.28),transparent_28%),radial-gradient(circle_at_18%_84%,rgba(0,128,128,0.26),transparent_30%),linear-gradient(135deg,#133A63_0%,#0B2540_48%,#008080_100%)]">
        <div className="pointer-events-none absolute -right-32 -top-36 h-[540px] w-[540px] rotate-[26deg] rounded-[42%] bg-[linear-gradient(135deg,rgba(169,209,232,0.55),rgba(218,165,32,0.24),rgba(255,255,255,0.12))] opacity-65" />
        <div className="pointer-events-none absolute -bottom-44 -left-36 h-[540px] w-[540px] rotate-[-24deg] rounded-[42%] bg-[linear-gradient(135deg,rgba(0,128,128,0.5),rgba(169,209,232,0.25),rgba(255,255,255,0.12))] opacity-65" />

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 font-body text-xs font-semibold tracking-[0.18em] text-accent-soft backdrop-blur-md">
            ABOUT CRAFTCONNECT
          </p>

          <h1 className="mx-auto max-w-4xl font-heading text-[clamp(2.4rem,6vw,5rem)] font-extrabold leading-tight tracking-[1px] text-text-light [text-shadow:0_0_18px_rgba(218,165,32,0.28)]">
            Connecting customers with trusted craftsmen
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[rgba(247,244,237,0.76)] sm:text-base">
            CraftConnect is a service marketplace platform that helps customers
            request home and professional services while allowing craftsmen to
            receive, manage, and complete tasks efficiently.
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
              onClick={() => navigate("/how-it-works")}
              variant="ghost"
              className="rounded-full border border-white/20 bg-white/10 px-7 py-3 font-extrabold text-text-light shadow-none backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20 hover:text-accent-soft"
            >
              How It Works
            </Btn>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F7F4ED_0%,#EAE3D4_55%,rgba(169,209,232,0.45)_100%)] px-4 py-16 sm:px-8 lg:px-16">
        <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-primary/10 bg-white/45 px-4 py-2 font-body text-xs font-bold tracking-[0.18em] text-primary shadow-soft backdrop-blur-md">
              SYSTEM OVERVIEW
            </p>

            <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight tracking-[1px] text-primary">
              A complete platform for service booking and management
            </h2>

            <p className="mt-4 text-sm leading-7 text-text-muted sm:text-base">
              The platform manages the full service journey, from registration
              and authentication to task booking, assignment, tracking,
              completion, and evaluation.
            </p>

            <p className="mt-4 text-sm leading-7 text-text-muted sm:text-base">
              Customers can request services, craftsmen can handle assigned
              tasks, and admins can monitor the whole process to maintain trust,
              quality, and performance.
            </p>
          </div>

          <div className="rounded-[32px] border border-white/60 bg-white/55 p-6 shadow-[0_25px_70px_rgba(19,58,99,0.14),inset_0_0_35px_rgba(255,255,255,0.45)] backdrop-blur-xl sm:p-8">
            <h3 className="mb-5 font-heading text-2xl font-extrabold text-primary">
              Platform Goals
            </h3>

            <div className="space-y-4">
              {goals.map((goal) => (
                <div
                  key={goal}
                  className="flex items-start gap-3 rounded-[20px] border border-white/60 bg-white/50 px-4 py-3 shadow-sm backdrop-blur-md"
                >
                  <CheckCircleIcon className="mt-0.5 text-accent" />
                  <p className="font-semibold leading-6 text-text-muted">
                    {goal}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Actors */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F7F4ED_0%,#EAE3D4_52%,rgba(169,209,232,0.5)_100%)] px-4 py-16 sm:px-8 lg:px-16">
        <div className="pointer-events-none absolute -right-28 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-28 bottom-10 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 inline-flex rounded-full border border-primary/10 bg-white/45 px-4 py-2 font-body text-xs font-bold tracking-[0.18em] text-primary shadow-soft backdrop-blur-md">
              MAIN USERS
            </p>

            <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-[1px] text-primary">
              Built for customers, craftsmen, and admins
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
              Each user type has a clear role in keeping the service process
              smooth, organized, and reliable.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {actors.map((actor) => (
              <div
                key={actor.title}
                className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-white/55 p-6 shadow-[0_18px_45px_rgba(19,58,99,0.12),inset_0_0_35px_rgba(255,255,255,0.45)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-accent/40 hover:bg-white/75 hover:shadow-[0_25px_60px_rgba(19,58,99,0.18)]"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-accent/20 blur-2xl transition group-hover:bg-accent/30" />
                <div className="pointer-events-none absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-teal/15 blur-2xl" />

                <div className="relative z-10">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(247,244,237,0.65)] bg-[linear-gradient(135deg,#A9D1E8_0%,#DAA520_100%)] text-primary-dark shadow-[0_0_28px_rgba(218,165,32,0.28)] transition-all duration-300 group-hover:scale-110">
                    {actor.icon}
                  </div>

                  <h3 className="mb-3 font-display text-xl font-extrabold text-primary">
                    {actor.title}
                  </h3>

                  <p className="text-sm leading-7 text-text-muted">
                    {actor.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F7F4ED_0%,#EAE3D4_55%,rgba(169,209,232,0.45)_100%)] px-4 py-16 sm:px-8 lg:px-16">
        <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-primary/10 bg-white/45 px-4 py-2 font-body text-xs font-bold tracking-[0.18em] text-primary shadow-soft backdrop-blur-md">
                CORE FEATURES
              </p>

              <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-[1px] text-primary">
                Designed to manage the full service lifecycle
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
                CraftConnect supports registration, booking, assignment,
                tracking, completion, reviews, and admin monitoring.
              </p>
            </div>

            <Btn
              type="button"
              onClick={() => navigate("/services")}
              variant="ghost"
              className="self-start rounded-full border border-primary/10 bg-white/50 px-5 py-3 font-bold text-primary shadow-soft backdrop-blur-md transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/70 hover:text-accent-hover lg:self-auto"
            >
              Explore services
              <ArrowForwardIcon fontSize="small" />
            </Btn>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group flex gap-5 rounded-[28px] border border-white/60 bg-white/55 p-6 shadow-[0_18px_45px_rgba(19,58,99,0.12),inset_0_0_35px_rgba(255,255,255,0.45)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-white/75"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[rgba(247,244,237,0.65)] bg-[linear-gradient(135deg,#A9D1E8_0%,#DAA520_100%)] text-primary-dark shadow-[0_0_24px_rgba(218,165,32,0.25)] transition-all duration-300 group-hover:scale-105">
                  {feature.icon}
                </div>

                <div>
                  <h3 className="mb-2 font-display text-lg font-extrabold text-primary">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-7 text-text-muted">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F7F4ED_0%,#EAE3D4_52%,rgba(169,209,232,0.5)_100%)] px-4 py-16 sm:px-8 lg:px-16">
        <div className="pointer-events-none absolute -right-28 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-28 bottom-10 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-[36px] border border-white/40 bg-[radial-gradient(circle_at_80%_10%,rgba(218,165,32,0.26),transparent_28%),radial-gradient(circle_at_10%_90%,rgba(0,128,128,0.25),transparent_32%),linear-gradient(135deg,#133A63_0%,#0B2540_58%,#008080_100%)] p-6 text-text-light shadow-[0_25px_70px_rgba(19,58,99,0.22),inset_0_0_45px_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-teal/25 blur-3xl" />

            <div className="relative z-10">
              <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.18em] text-accent-soft backdrop-blur-md">
                SYSTEM BEHAVIOR
              </p>

              <h2 className="font-heading text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-tight tracking-[1px] text-text-light [text-shadow:0_0_18px_rgba(218,165,32,0.28)]">
                From request to completed service
              </h2>

              <p className="mt-4 text-sm leading-7 text-[rgba(247,244,237,0.76)] sm:text-base">
                Customers create service requests, the system assigns tasks to
                craftsmen, craftsmen complete the work, and admins monitor the
                platform to ensure quality.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {process.map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-[24px] border border-white/60 bg-white/55 px-5 py-4 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/75"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(247,244,237,0.65)] bg-gold-gradient font-extrabold text-primary-dark shadow-[0_0_22px_rgba(218,165,32,0.22)]">
                  {index + 1}
                </div>

                <p className="pt-1 font-semibold leading-6 text-primary">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin & Trust */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F7F4ED_0%,#EAE3D4_55%,rgba(169,209,232,0.45)_100%)] px-4 py-16 sm:px-8 lg:px-16">
        <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="mb-3 inline-flex rounded-full border border-primary/10 bg-white/45 px-4 py-2 font-body text-xs font-bold tracking-[0.18em] text-primary shadow-soft backdrop-blur-md">
            TRUST & CONTROL
          </p>

          <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-[1px] text-primary">
            Quality is managed at every stage
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-text-muted sm:text-base">
            Admins can approve or reject craftsman applications, monitor
            in-progress and completed tasks, review customer feedback, manage
            users, and take action against low performance or fake accounts.
          </p>

          <Btn
            type="button"
            onClick={() => navigate("/services")}
            variant="ghost"
            className="mt-8 rounded-full border border-[rgba(247,244,237,0.65)] bg-gold-gradient px-7 py-3 font-extrabold text-primary-dark shadow-[0_12px_26px_rgba(218,165,32,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(218,165,32,0.36)]"
          >
            Start Booking
            <ArrowForwardIcon fontSize="small" />
          </Btn>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
