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
    <section
      id={id}
      className="relative w-full overflow-hidden bg-[linear-gradient(135deg,#F7F4ED_0%,#EAE3D4_52%,rgba(169,209,232,0.55)_100%)] px-4 py-16 sm:px-8 lg:px-16"
    >
      <div className="pointer-events-none absolute -left-28 top-12 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />

      {/* Title */}
      <div className="relative z-10 mb-12 text-center">
        <p className="mb-3 inline-flex rounded-full border border-primary/10 bg-white/45 px-4 py-2 font-body text-xs font-bold tracking-[0.18em] text-primary shadow-soft backdrop-blur-md">
          SIMPLE PROCESS
        </p>

        <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-[1px] text-primary">
          How It Works
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-text-muted sm:text-base">
          Simple steps to get your job done with trusted craftsmen near you.
        </p>
      </div>

      {/* Steps */}
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-white/55 p-6 text-center shadow-[0_18px_45px_rgba(19,58,99,0.12),inset_0_0_35px_rgba(255,255,255,0.45)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-accent/40 hover:bg-white/75 hover:shadow-[0_25px_60px_rgba(19,58,99,0.18)]"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-accent/20 blur-2xl transition group-hover:bg-accent/30" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-teal/15 blur-2xl" />

            {/* Step number */}
            <div className="absolute left-5 top-5 rounded-full border border-white/40 bg-primary/90 px-3 py-1 text-xs font-bold text-text-light shadow-[0_8px_22px_rgba(19,58,99,0.22)]">
              Step {index + 1}
            </div>

            {/* Icon */}
            <div className="mx-auto mb-5 mt-8 flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(247,244,237,0.55)] bg-[linear-gradient(135deg,#A9D1E8_0%,#DAA520_100%)] text-xl text-surface shadow-[0_0_28px_rgba(218,165,32,0.28)] transition-all duration-300 group-hover:scale-110">
              {step.icon}
            </div>

            {/* Content */}
            <h3 className="mb-2 font-display text-base font-extrabold text-primary sm:text-lg">
              {step.title}
            </h3>

            <p className="text-xs leading-relaxed text-text-muted sm:text-sm">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
