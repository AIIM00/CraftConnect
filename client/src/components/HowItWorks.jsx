import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SentimentVerySatisfiedSharpIcon from "@mui/icons-material/SentimentVerySatisfiedSharp";

const steps = [
  {
    title: "Post Your Task",
    description: "Tell us what you need done in just a few minutes.",
    icon: AssignmentTurnedInIcon,
  },
  {
    title: "Get Matched",
    description: "We connect you with trusted craftsmen near you.",
    icon: PeopleIcon,
  },
  {
    title: "Get It Done",
    description: "Your selected professional completes the job.",
    icon: CalendarMonthIcon,
  },
  {
    title: "Review & Relax",
    description: "Rate the service and enjoy peace of mind.",
    icon: SentimentVerySatisfiedSharpIcon,
  },
];

export default function HowItWorks({ id }) {
  return (
    <section
      id={id}
      className="relative w-full overflow-hidden bg-background-dark bg-hero-gradient px-4 py-16 sm:px-8 lg:px-16"
    >
      <div className="pointer-events-none absolute -left-28 top-12 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-container">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-secondary/20 bg-secondary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary shadow-soft">
            Simple Process
          </p>

          <h2 className="font-heading text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            How It Works
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-text-muted sm:text-base">
            Simple steps to get your job done with trusted craftsmen near you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="group relative overflow-hidden rounded-2xl border border-border-soft bg-card-gradient p-6 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-secondary/40 hover:shadow-card"
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-secondary/10 blur-2xl transition group-hover:bg-secondary/20" />
                <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />

                <div className="relative z-10">
                  <div className="mb-8 flex items-center justify-between">
                    <span className="rounded-full border border-border-soft bg-background px-3 py-1 text-xs font-bold text-secondary shadow-soft">
                      Step {index + 1}
                    </span>

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card transition duration-300 group-hover:scale-110">
                      <Icon fontSize="small" />
                    </div>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-primary">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-text-muted">
                    {step.description}
                  </p>

                  <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-background-light">
                    <div className="h-full w-2/3 rounded-full bg-secondary-gradient transition-all duration-300 group-hover:w-full" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
