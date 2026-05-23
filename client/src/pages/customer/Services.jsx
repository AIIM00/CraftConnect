import Services from "../../components/Services";
import Btn from "../../components/Btn";

// MUI Icons
import SearchIcon from "@mui/icons-material/Search";

export default function ServicesPage({ id }) {
  return (
    <main id={id} className="w-full bg-bg">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-32 text-text-light sm:px-8 lg:px-16 bg-[radial-gradient(circle_at_72%_18%,rgba(218,165,32,0.28),transparent_28%),radial-gradient(circle_at_18%_84%,rgba(0,128,128,0.26),transparent_30%),linear-gradient(135deg,#133A63_0%,#0B2540_48%,#008080_100%)]">
        <div className="pointer-events-none absolute -right-32 -top-36 h-[540px] w-[540px] rotate-[26deg] rounded-[42%] bg-[linear-gradient(135deg,rgba(169,209,232,0.55),rgba(218,165,32,0.24),rgba(255,255,255,0.12))] opacity-65" />
        <div className="pointer-events-none absolute -bottom-44 -left-36 h-[540px] w-[540px] rotate-[-24deg] rounded-[42%] bg-[linear-gradient(135deg,rgba(0,128,128,0.5),rgba(169,209,232,0.25),rgba(255,255,255,0.12))] opacity-65" />

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 font-body text-xs font-semibold tracking-[0.18em] text-accent-soft backdrop-blur-md">
            CRAFTCONNECT SERVICES
          </p>

          <h1 className="mx-auto max-w-4xl font-heading text-[clamp(2.4rem,6vw,5rem)] font-extrabold leading-tight tracking-[1px] text-text-light [text-shadow:0_0_18px_rgba(218,165,32,0.28)]">
            Find the right professional for every job
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[rgba(247,244,237,0.76)] sm:text-base">
            Browse trusted craftsmen and home service experts by category.
          </p>

          <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-[24px] border border-white/30 bg-white/15 p-2 shadow-[0_25px_70px_rgba(19,58,99,0.26),inset_0_0_35px_rgba(255,255,255,0.06)] backdrop-blur-[22px]">
            <SearchIcon className="mx-3 text-[rgba(247,244,237,0.75)]" />

            <input
              type="text"
              placeholder="Search for plumber, cleaner, carpenter..."
              className="min-w-0 flex-1 bg-transparent px-1 text-sm text-text-light outline-none placeholder:text-[rgba(247,244,237,0.55)]"
            />

            <Btn
              type="button"
              variant="ghost"
              className="min-h-[46px] rounded-full border border-[rgba(247,244,237,0.55)] bg-gold-gradient px-6 font-extrabold text-primary-dark shadow-[0_12px_26px_rgba(218,165,32,0.24)] hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(218,165,32,0.36)]"
            >
              Search
            </Btn>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#F7F4ED_0%,#EAE3D4_55%,rgba(169,209,232,0.45)_100%)] px-4 py-16 sm:px-8 lg:px-16">
        <div className="pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-10 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-primary/10 bg-white/45 px-4 py-2 font-body text-xs font-bold tracking-[0.18em] text-primary shadow-soft backdrop-blur-md">
                AVAILABLE SERVICES
              </p>

              <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-[1px] text-primary">
                Browse by Category
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
                Explore service categories and quickly find skilled workers near
                you.
              </p>
            </div>
          </div>

          <Services />
        </div>
      </section>
    </main>
  );
}
