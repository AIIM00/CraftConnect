import Box from "@mui/material/Box";
import CraftsmenPie from "./CraftsmenPie";
import Btn from "./Btn";

// Icons
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SentimentVerySatisfiedSharpIcon from "@mui/icons-material/SentimentVerySatisfiedSharp";

const Header = ({ id }) => {
  return (
    <header
      id={id}
      className="relative min-h-screen overflow-hidden px-4 pt-32 pb-20 sm:px-8 lg:px-12 bg-[radial-gradient(circle_at_72%_18%,rgba(218,165,32,0.28),transparent_28%),radial-gradient(circle_at_18%_84%,rgba(0,128,128,0.26),transparent_30%),linear-gradient(135deg,#133A63_0%,#0B2540_48%,#008080_100%)]"
    >
      <div className="pointer-events-none absolute -right-32 -top-36 z-0 h-[540px] w-[540px] rotate-[26deg] rounded-[42%] bg-[linear-gradient(135deg,rgba(169,209,232,0.55),rgba(218,165,32,0.24),rgba(255,255,255,0.12))] opacity-65" />

      <div className="pointer-events-none absolute -bottom-44 -left-36 z-0 h-[540px] w-[540px] rotate-[-24deg] rounded-[42%] bg-[linear-gradient(135deg,rgba(0,128,128,0.5),rgba(169,209,232,0.25),rgba(255,255,255,0.12))] opacity-65" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-12 lg:flex-row lg:gap-8">
        <div className="w-full text-center lg:w-1/2 lg:text-left">
          <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 font-body text-xs font-semibold tracking-[0.18em] text-accent-soft backdrop-blur-md">
            CRAFTCONNECT
          </p>

          <h1 className="font-heading text-[clamp(2.6rem,6vw,5.5rem)] font-extrabold leading-[0.95] tracking-[1px] text-text-light [text-shadow:0_0_18px_rgba(218,165,32,0.28)]">
            Find Trusted
            <span className="mt-2 block bg-[linear-gradient(135deg,#A9D1E8_0%,#F7F4ED_45%,#DAA520_100%)] bg-clip-text text-transparent">
              Craftsmen.
            </span>
          </h1>

          <h2 className="mt-4 font-heading text-[clamp(2rem,5vw,4rem)] font-extrabold leading-tight text-primary-light">
            Get Things Done.
          </h2>

          <p className="mx-auto mt-6 max-w-xl font-body text-sm leading-7 text-[rgba(247,244,237,0.76)] sm:text-base lg:mx-0">
            Post your task, and we&apos;ll match you with skilled professionals
            in your area. Fast, reliable, and hassle-free.
          </p>

          <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-[24px] border border-white/30 bg-white/15 p-2 shadow-[0_25px_70px_rgba(19,58,99,0.26),inset_0_0_35px_rgba(255,255,255,0.06)] backdrop-blur-[22px] lg:mx-0">
            <SearchIcon className="mx-3 text-[rgba(247,244,237,0.75)]" />

            <input
              type="text"
              placeholder="Search for plumber, cleaner, carpenter..."
              className="min-w-0 flex-1 bg-transparent px-1 font-body text-sm text-text-light outline-none placeholder:text-[rgba(247,244,237,0.55)]"
            />

            <Btn
              type="button"
              variant="ghost"
              className="min-h-[46px] rounded-full px-6 text-primary-dark font-extrabold bg-gold-gradient border border-[rgba(247,244,237,0.55)] shadow-[0_12px_26px_rgba(218,165,32,0.24)] hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(218,165,32,0.36)]"
            >
              Search
            </Btn>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 text-sm text-[rgba(247,244,237,0.76)] sm:grid-cols-2 lg:mt-14">
            <Box className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md transition hover:border-accent/40 hover:text-accent-soft lg:justify-start">
              <VerifiedUserIcon fontSize="small" />
              <p>Verified Professionals</p>
            </Box>

            <Box className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md transition hover:border-accent/40 hover:text-accent-soft lg:justify-start">
              <StarBorderIcon fontSize="small" />
              <p>Quality Work</p>
            </Box>

            <Box className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md transition hover:border-accent/40 hover:text-accent-soft lg:justify-start">
              <TimerOutlinedIcon fontSize="small" />
              <p>On-Time Service</p>
            </Box>

            <Box className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md transition hover:border-accent/40 hover:text-accent-soft lg:justify-start">
              <SentimentVerySatisfiedSharpIcon fontSize="small" />
              <p>100% Satisfaction</p>
            </Box>
          </div>
        </div>

        <div className="flex w-full justify-center lg:w-1/2">
          <div className="relative w-fit max-w-[560px] lg:max-w-[480px]  rounded-[36px] border border-white/25 bg-white/10  shadow-[0_25px_70px_rgba(19,58,99,0.26),inset_0_0_45px_rgba(255,255,255,0.06)] backdrop-blur-[22px] ">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-accent/25 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-teal/30 blur-2xl" />

            <div className=" p-4 relative z-10">
              <CraftsmenPie />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
