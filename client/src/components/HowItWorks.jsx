import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SentimentVerySatisfiedSharpIcon from "@mui/icons-material/SentimentVerySatisfiedSharp";

const steps = [
  {
    title: "Post Your Task",
    description: "Tell us what you need done in just a few minutes.",
    icon: <AssignmentTurnedInIcon />,
  },
  {
    title: "Get Matched",
    description: "We connect you with trusted craftsmen near you.",
    icon: <PeopleIcon />,
  },
  {
    title: "Get It Done",
    description: "Your selected professional completes the job.",
    icon: <CalendarMonthIcon />,
  },
  {
    title: "Review & Relax",
    description: "Rate the service and enjoy peace of mind.",
    icon: <SentimentVerySatisfiedSharpIcon />,
  },
];

export default function HowItWorks({ id }) {
  return (
    <section id={id} className="w-full py-12 px-4 sm:px-8 lg:px-16 bg-gray-50">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
          How It Works
        </h2>
        <p className="text-sm sm:text-base text-text-muted mt-2">
          Simple steps to get your job done
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-2  lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition"
          >
            {/* Step number */}
            <div className="absolute -top-4 left-4 bg-primary text-white text-xs px-3 py-1 rounded-full">
              Step {index + 1}
            </div>

            {/* Icon */}
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4 text-2xl">
              {step.icon}
            </div>

            {/* Content */}
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              {step.title}
            </h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
