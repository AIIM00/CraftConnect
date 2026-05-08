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
    <section id={id} className="w-full px-4 sm:px-6 lg:px-16 py-6">
      <div className="w-full max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((step) => (
            <Box
              key={step.title}
              className="w-full flex items-start  rounded-xl  p-4 hover:bg-gray-100 transition"
            >
              <Avatar className="!bg-primary shrink-0 mr-4">{step.icon}</Avatar>

              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-primary">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed break-words">
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
