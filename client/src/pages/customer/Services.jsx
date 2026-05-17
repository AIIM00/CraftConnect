import { AppContext } from "../../context/AppContext";

//Components
import Services from "../../components/Services";
import Btn from "../../components/Btn";

//MUI Icons
import SearchIcon from "@mui/icons-material/Search";

export default function ServicesPage({ id }) {
  return (
    <>
      <main id={id} className="w-full bg-bg">
        {/* Hero */}
        <section className="bg-text-muted text-white px-4 sm:px-8 lg:px-16 py-16">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-accent-hover font-semibold mb-3">
              CraftConnect Services
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold max-w-3xl mx-auto">
              Find the right professional for every job
            </h1>

            <p className="text-white/75 mt-4 max-w-2xl mx-auto">
              Browse trusted craftsmen and home service experts by category.
            </p>

            <div className="mt-8 max-w-xl mx-auto flex items-center rounded-3xl border border-white/30 bg-white/15 p-2 shadow-[0_0_35px_rgba(255,255,255,0.18)] backdrop-blur-xl">
              <SearchIcon className="mx-3 text-white/80 drop-shadow-sm" />

              <input
                type="text"
                placeholder="Search for plumber, cleaner, carpenter..."
                className="flex-1 bg-transparent px-2 text-white placeholder:text-white/60 outline-none"
              />

              <Btn
                type="button"
                variant="primary"
                className="rounded-full px-5 py-2 font-semibold"
              >
                Search
              </Btn>
            </div>
          </div>
        </section>
        {/* Categories */}
        <section className="px-4 sm:px-8 lg:px-16 py-14">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <p className="text-sm font-semibold text-primary-light mb-2">
                  Available Services
                </p>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                  Browse by Category
                </h2>

                <p className="text-sm sm:text-base text-text-muted mt-3 max-w-2xl">
                  Explore service categories and quickly find skilled workers
                  near you.
                </p>
              </div>
            </div>
            <Services />
          </div>
        </section>
      </main>
    </>
  );
}
