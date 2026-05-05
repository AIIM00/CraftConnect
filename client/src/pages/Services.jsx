import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

//Components
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Services from "../components/Services";

//MUI Icons
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";

export default function ServicesPage({ id }) {
  const navigate = useNavigate();
  return (
    <>
      <NavBar />
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

            <div className="mt-8 max-w-xl mx-auto bg-white rounded-2xl p-2 flex items-center shadow-lg">
              <SearchIcon className="text-text-muted mx-3" />

              <input
                type="text"
                placeholder="Search for plumber, cleaner, carpenter..."
                className="flex-1 outline-none text-text px-2"
              />

              <button className="bg-accent hover:bg-accent-hover text-white px-5 py-3 rounded-xl font-semibold transition">
                Search
              </button>
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

              <button
                onClick={() => navigate("/")}
                className="self-start sm:self-auto flex items-center gap-2 text-primary font-semibold hover:text-primary-light transition"
              >
                Back home
                <ArrowForwardIcon fontSize="small" />
              </button>
            </div>
            <Services />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
