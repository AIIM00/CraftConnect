import React from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
//Components
import Btn from "../../components/Btn";
import Header from "../../components/Header";
import HowItWorksSteps from "../../components/HowItWorksSteps";
import HowItWorks from "../../components/HowItWorks";
import Services from "../../components/Services";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  return (
    <>
      <Header id="header" />
      <HowItWorksSteps id="process" />
      <HowItWorks id="howItWorks" />
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F7F4ED_0%,#EAE3D4_55%,rgba(169,209,232,0.45)_100%)] px-4 py-16 sm:px-8 lg:px-16">
        <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-primary/10 bg-white/45 px-4 py-2 font-body text-xs font-bold tracking-[0.18em] text-primary shadow-soft backdrop-blur-md">
                POPULAR SERVICES
              </p>

              <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-[1px] text-primary">
                Browse Popular Services
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
                Explore trusted craftsmen by category and quickly find the right
                professional for your next job.
              </p>
            </div>

            <Btn
              type="button"
              onClick={() => navigate("/services")}
              variant="ghost"
              className="self-start rounded-full border border-primary/10 bg-white/50 px-5 py-3 font-bold text-primary shadow-soft backdrop-blur-md transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/70 hover:text-accent-hover sm:self-auto"
            >
              View all
              <ArrowForwardIcon fontSize="small" />
            </Btn>
          </div>

          <Services id="services" limit={4} />
        </div>
      </section>
    </>
  );
};

export default Home;
