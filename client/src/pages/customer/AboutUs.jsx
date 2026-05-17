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

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="bg-primary text-white px-4 sm:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-accent-hover font-semibold mb-3">
            About CraftConnect
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold max-w-3xl mx-auto">
            Connecting customers with trusted craftsmen
          </h1>

          <p className="text-white/75 mt-4 max-w-2xl mx-auto leading-7">
            CraftConnect is a service marketplace platform that helps customers
            request home and professional services while allowing craftsmen to
            receive, manage, and complete tasks efficiently.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Btn
              type="button"
              onClick={() => navigate("/customer/services")}
              variant="primary"
              className="px-6 py-3 font-bold"
            >
              Browse Services
              <ArrowForwardIcon fontSize="small" />
            </Btn>

            <Btn
              type="button"
              onClick={() => navigate("/how-it-works")}
              variant="outline"
              className="px-6 py-3 font-bold border-white/25 text-white hover:bg-white/10 hover:text-white"
            >
              How It Works
            </Btn>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="px-4 sm:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-semibold text-primary-light mb-2">
              System Overview
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
              A complete platform for service booking and management
            </h2>

            <p className="text-text-muted mt-4 leading-7">
              The platform manages the full service journey, from registration
              and authentication to task booking, assignment, tracking,
              completion, and evaluation.
            </p>

            <p className="text-text-muted mt-4 leading-7">
              Customers can request services, craftsmen can handle assigned
              tasks, and admins can monitor the whole process to maintain trust,
              quality, and performance.
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
            <h3 className="text-xl font-bold text-primary mb-5">
              Platform Goals
            </h3>

            <div className="space-y-4">
              {[
                "Make service booking simple for customers",
                "Help craftsmen find and manage work",
                "Assign tasks fairly using round robin logic",
                "Allow admins to monitor quality and performance",
                "Support reviews, warnings, and account management",
              ].map((goal) => (
                <div key={goal} className="flex items-start gap-3">
                  <CheckCircleIcon className="text-accent mt-0.5" />
                  <p className="text-text-muted font-medium">{goal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Actors */}
      <section className="bg-white px-4 sm:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary-light mb-2">
              Main Users
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
              Built for customers, craftsmen, and admins
            </h2>

            <p className="text-text-muted mt-3 max-w-2xl mx-auto">
              Each user type has a clear role in keeping the service process
              smooth, organized, and reliable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {actors.map((actor) => (
              <div
                key={actor.title}
                className="rounded-3xl bg-bg border border-gray-100 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
                  {actor.icon}
                </div>

                <h3 className="text-xl font-bold text-primary mb-3">
                  {actor.title}
                </h3>

                <p className="text-text-muted leading-6">{actor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10">
            <div>
              <p className="text-sm font-semibold text-primary-light mb-2">
                Core Features
              </p>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                Designed to manage the full service lifecycle
              </h2>

              <p className="text-text-muted mt-3 max-w-2xl">
                CraftConnect supports registration, booking, assignment,
                tracking, completion, reviews, and admin monitoring.
              </p>
            </div>

            <Btn
              type="button"
              onClick={() => navigate("/customer/services")}
              variant="ghost"
              className="self-start lg:self-auto border-none bg-transparent px-0 py-0 text-primary font-semibold shadow-none hover:bg-transparent hover:text-primary-light"
            >
              Explore services
              <ArrowForwardIcon fontSize="small" />
            </Btn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm flex gap-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
                  {feature.icon}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-primary mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-text-muted leading-6">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white px-4 sm:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-3xl bg-primary text-white p-6 sm:p-8">
            <p className="text-accent-hover font-semibold mb-3">
              System Behavior
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold">
              From request to completed service
            </h2>

            <p className="text-white/75 mt-4 leading-7">
              Customers create service requests, the system assigns tasks to
              craftsmen, craftsmen complete the work, and admins monitor the
              platform to ensure quality.
            </p>
          </div>

          <div className="space-y-4">
            {process.map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-2xl bg-bg border border-gray-100 px-5 py-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold">
                  {index + 1}
                </div>

                <p className="font-semibold text-primary pt-1">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin & Trust */}
      <section className="px-4 sm:px-8 lg:px-16 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-semibold text-primary-light mb-2">
            Trust & Control
          </p>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
            Quality is managed at every stage
          </h2>

          <p className="text-text-muted mt-4 leading-7 max-w-3xl mx-auto">
            Admins can approve or reject craftsman applications, monitor
            in-progress and completed tasks, review customer feedback, manage
            users, and take action against low performance or fake accounts.
          </p>

          <Btn
            type="button"
            onClick={() => navigate("/services")}
            variant="primary"
            className="mt-8 rounded-full px-7 py-3 font-bold"
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
