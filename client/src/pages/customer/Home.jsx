import React from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import Btn from "../../components/Btn";
import Header from "../../components/Header";
import HowItWorksSteps from "../../components/HowItWorksSteps";
import HowItWorks from "../../components/HowItWorks";
import Services from "../../components/Services";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const el = document.querySelector(location.hash);

    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <>
      <Header id="header" />
      <HowItWorksSteps id="process" />
      <HowItWorks id="howItWorks" />

      <section className="relative overflow-hidden bg-background-dark bg-hero-gradient px-4 py-16 sm:px-8 lg:px-16">
        <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-container">
          <div className="mb-10 overflow-hidden rounded-2xl border border-border-soft bg-card-gradient p-5 shadow-card sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-4 inline-flex rounded-full border border-secondary/20 bg-secondary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                  Popular Services
                </p>

                <h2 className="font-heading text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                  Browse Popular Services
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
                  Explore trusted craftsmen by category and quickly find the
                  right professional for your next job.
                </p>
              </div>

              <Btn
                type="button"
                onClick={() => navigate("/services")}
                variant="ghost"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border-soft bg-background px-5 py-3 text-sm font-semibold text-primary shadow-soft transition hover:bg-background-light hover:text-primary-hover sm:w-auto"
              >
                View all
                <ArrowForwardIcon fontSize="small" />
              </Btn>
            </div>
          </div>

          <Services id="services" limit={4} />
        </div>
      </section>
    </>
  );
};

export default Home;
