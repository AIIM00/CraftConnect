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
      <section
        id="services"
        className="w-full bg-white px-4 sm:px-8 lg:px-16 py-14 "
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm font-semibold text-primary-light mb-2">
                Popular Services
              </p>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                Browse Popular Services
              </h2>

              <p className="text-sm sm:text-base text-text-muted mt-3 max-w-2xl">
                Explore trusted craftsmen by category and quickly find the right
                professional for your next job.
              </p>
            </div>

            <Btn
              type="button"
              onClick={() => navigate("/customer/services")}
              variant="ghost"
              className="self-start sm:self-auto px-0 py-0 font-semibold"
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
