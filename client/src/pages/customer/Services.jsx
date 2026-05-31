import Services from "../../components/Services";
import Btn from "../../components/Btn";

// MUI Icons
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function ServicesPage({ id }) {
  return (
    <main
      id={id}
      className="w-full overflow-hidden bg-background-dark bg-hero-gradient"
    >
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary-gradient px-4 pb-20 pt-32 text-white sm:px-8 lg:px-16">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-secondary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-container text-center">
          <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary backdrop-blur-sm">
            CraftConnect Services
          </p>

          <h1 className="mx-auto max-w-5xl font-heading text-4xl font-extrabold leading-tight sm:text-5xl lg:text-7xl">
            Find the right professional for every job
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            Browse trusted craftsmen and home service experts by category.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-8 lg:px-16">
        <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-container">
          <div className="mb-10 overflow-hidden rounded-3xl border border-border-soft bg-card-gradient p-6 shadow-card sm:p-8 lg:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-4 inline-flex rounded-full border border-secondary/20 bg-secondary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                  Available Services
                </p>

                <h2 className="font-heading text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                  Browse by Category
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
                  Explore service categories and quickly find skilled workers
                  near you.
                </p>
              </div>
            </div>
          </div>

          <Services />
        </div>
      </section>
    </main>
  );
}
