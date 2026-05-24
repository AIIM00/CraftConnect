import Box from "@mui/material/Box";
import CraftsmenPie from "./CraftsmenPie";
import Btn from "./Btn";

import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SentimentVerySatisfiedSharpIcon from "@mui/icons-material/SentimentVerySatisfiedSharp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Header = ({ id }) => {
  return (
    <header
      id={id}
      className="relative min-h-screen overflow-hidden bg-background-dark bg-hero-gradient px-4 pb-16 pt-28 sm:px-8 sm:pt-32 lg:px-12"
    >
      <div className="pointer-events-none absolute -right-32 -top-36 h-[540px] w-[540px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-44 -left-36 h-[540px] w-[540px] rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-container flex-col-reverse items-center justify-between gap-12 lg:flex-row lg:gap-10">
        <div className="w-full text-center lg:w-1/2 lg:text-left">
          <p className="mb-5 inline-flex rounded-full border border-secondary/20 bg-secondary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary shadow-soft">
            CraftConnect
          </p>

          <h1 className="font-heading text-5xl font-extrabold leading-[0.95] text-primary sm:text-6xl lg:text-7xl">
            Find Trusted
            <span className="mt-2 block bg-primary-gradient bg-clip-text text-transparent">
              Craftsmen.
            </span>
          </h1>

          <h2 className="mt-4 font-heading text-3xl font-bold text-text sm:text-4xl lg:text-5xl">
            Get Things Done.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-text-muted sm:text-base lg:mx-0">
            Post your task, and we&apos;ll match you with skilled professionals
            in your area. Fast, reliable, and hassle-free.
          </p>

          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-2xl border border-border-soft bg-background p-3 shadow-card sm:flex-row sm:items-center lg:mx-0">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-background-dark px-4 py-3">
              <SearchIcon className="text-text-muted" />

              <input
                type="text"
                placeholder="Search for plumber, cleaner, carpenter..."
                className="min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
              />
            </div>

            <Btn
              type="button"
              variant="ghost"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary-gradient px-6 text-sm font-semibold text-white shadow-card transition duration-300 hover:scale-[1.01] hover:shadow-elevated"
            >
              Search
              <ArrowForwardIcon fontSize="small" />
            </Btn>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-2 text-sm text-text-muted sm:grid-cols-2 lg:mt-12">
            {[
              {
                icon: VerifiedUserIcon,
                label: "Verified Professionals",
              },
              {
                icon: StarBorderIcon,
                label: "Quality Work",
              },
              {
                icon: TimerOutlinedIcon,
                label: "On-Time Service",
              },
              {
                icon: SentimentVerySatisfiedSharpIcon,
                label: "100% Satisfaction",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Box
                  key={item.label}
                  className="
    group
    flex items-center gap-4
    rounded-2xl
    border border-border-soft
    bg-card-gradient
    px-5 py-4
    shadow-soft
    transition-all duration-300
    hover:-translate-y-1
    hover:border-secondary/30
    hover:shadow-card
  "
                >
                  <div
                    className="
      flex h-11 w-11 shrink-0
      items-center justify-center
      rounded-xl
      bg-primary-gradient
      text-white
      shadow-soft
    "
                  >
                    <Icon fontSize="small" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-text transition group-hover:text-primary">
                      {item.label}
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      Trusted professional service
                    </p>
                  </div>
                </Box>
              );
            })}
          </div>
        </div>

        <div className="flex w-full justify-center lg:w-1/2">
          <div className="relative w-full max-w-[560px] overflow-hidden rounded-2xl border border-border-soft bg-card-gradient p-4 shadow-glass lg:max-w-[500px]">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-secondary/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/15 blur-3xl" />

            <div className="relative z-10">
              <CraftsmenPie />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
