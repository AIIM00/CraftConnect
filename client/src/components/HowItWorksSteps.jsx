import Box from "@mui/material/Box";

import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SentimentVerySatisfiedSharpIcon from "@mui/icons-material/SentimentVerySatisfiedSharp";

const steps = [
  {
    title: "Easy Booking",
    description: "Tell us what you need done in minutes.",
    icon: AssignmentTurnedInIcon,
  },
  {
    title: "Matched with Pros",
    description: "We find the right craftsman for your task.",
    icon: PeopleIcon,
  },
  {
    title: "Get It Done",
    description: "Your craftsman completes the job with care.",
    icon: CalendarMonthIcon,
  },
  {
    title: "Satisfaction",
    description: "Review the work and help others.",
    icon: SentimentVerySatisfiedSharpIcon,
  },
];

export default function HowItWorksSteps({ id }) {
  return (
    <section
      id={id}
      className="relative z-20 w-full bg-background-dark px-4 pb-12 sm:px-6 lg:px-16"
    >
      <div className="mx-auto w-full max-w-container -mt-14 rounded-2xl border border-border-soft bg-card-gradient p-4 shadow-glass sm:p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Box
                key={step.title}
                className="group relative overflow-hidden rounded-2xl border border-border-soft bg-background p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-card"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-secondary/10 blur-2xl transition group-hover:bg-secondary/20" />

                <div className="relative z-10 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card transition duration-300 group-hover:scale-105">
                    <Icon fontSize="small" />
                  </div>

                  <div className="min-w-0">
                    <p className="mb-1 text-xs font-bold text-secondary">
                      STEP {index + 1}
                    </p>

                    <h3 className="font-heading text-base font-bold text-primary">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-text-muted">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Box>
            );
          })}
        </div>
      </div>
    </section>
  );
}
