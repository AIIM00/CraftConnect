import Box from "@mui/material/Box";
import CraftsmenPie from "./CraftsmenPie";
import Btn from "./Btn";

//Icons
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SentimentVerySatisfiedSharpIcon from "@mui/icons-material/SentimentVerySatisfiedSharp";

const Header = ({ id }) => {
  return (
    <div
      id={id}
      className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-2 items-center justify-between px-4 sm:px-8 lg:px-12 py-8"
    >
      <div className="w-full lg:w-1/2 lg:p-12 text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-primary mb-3">
          Find Trusted Craftsmen.
        </h1>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-primary-light mb-6">
          Get Things Done.
        </h1>

        <p className="text-text-muted text-xs sm:text-sm mb-8 lg:mb-12">
          Post your task, and we'll match you with skilled professionals in your
          area.
          <br className="hidden sm:block" />
          Fast, reliable, and hassle-free.
        </p>

        <div className="mt-8 max-w-xl mx-auto bg-white rounded-2xl p-2 flex items-center shadow-lg">
          <SearchIcon className="text-text-muted mx-3" />

          <input
            type="text"
            placeholder="Search for plumber, cleaner, carpenter..."
            className="flex-1 outline-none text-text px-2"
          />

          <Btn>Search</Btn>
        </div>

        <div className="grid grid-cols-2 sm:flex gap-4 items-center justify-center lg:justify-start text-xs sm:text-sm text-text-muted mt-10 lg:mt-20">
          <Box className="flex items-center gap-2 hover:text-accent-hover">
            <VerifiedUserIcon className="" />
            <p>Verified Professionals</p>
          </Box>

          <Box className="flex items-center gap-2 hover:text-accent-hover">
            <StarBorderIcon />
            <p>Quality Work</p>
          </Box>

          <Box className="flex items-center gap-2 hover:text-accent-hover">
            <TimerOutlinedIcon />
            <p>On-Time Service</p>
          </Box>

          <Box className="flex items-center gap-2 hover:text-accent-hover">
            <SentimentVerySatisfiedSharpIcon />
            <p>100% satisfaction</p>
          </Box>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex justify-center">
        <CraftsmenPie />
      </div>
    </div>
  );
};

export default Header;
