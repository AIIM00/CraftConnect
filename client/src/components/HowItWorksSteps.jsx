import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";

import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SentimentVerySatisfiedSharpIcon from "@mui/icons-material/SentimentVerySatisfiedSharp";

const steps = [
  {
    title: "Easy Booking",
    description: "Tell us what you need done in minutes",
    icon: <AssignmentTurnedInIcon />,
  },
  {
    title: "Matched with Pros",
    description: "We find the right craftsman for your task",
    icon: <PeopleIcon />,
  },
  {
    title: "Get It Done",
    description: "Your craftsman completes the job with care.",
    icon: <CalendarMonthIcon />,
  },
  {
    title: "Satisfaction",
    description: "Review the work and help others.",
    icon: <SentimentVerySatisfiedSharpIcon />,
  },
];

export default function HowItWorksSteps({ id }) {
  return (
    <section
      id={id}
      className="relative z-20 w-full px-4 sm:px-6 lg:px-16 -mt-12 pb-10"
    >
      <div className="mx-auto w-full max-w-7xl rounded-[32px] border border-white/40 bg-[linear-gradient(145deg,rgba(255,255,255,0.82),rgba(247,244,237,0.68))] p-4 shadow-[0_25px_70px_rgba(19,58,99,0.18),inset_0_0_35px_rgba(255,255,255,0.5)] backdrop-blur-xl sm:p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <Box
              key={step.title}
              className="group flex w-full items-start rounded-[24px] border border-white/60 bg-white/45 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-white/70 hover:shadow-[0_18px_45px_rgba(19,58,99,0.14)]"
            >
              <Avatar className="!mr-4 !h-12 !w-12 !shrink-0 !bg-[linear-gradient(135deg,#A9D1E8_0%,#DAA520_100%)] text-surface shadow-[0_0_24px_rgba(218,165,32,0.25)] transition-all duration-300 group-hover:scale-105">
                {step.icon}
              </Avatar>

              <div className="min-w-0">
                <h3 className="font-display text-sm font-extrabold text-primary sm:text-base">
                  {step.title}
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-text-muted sm:text-sm">
                  {step.description}
                </p>
              </div>
            </Box>
          ))}
        </div>
      </div>
    </section>
  );
}
