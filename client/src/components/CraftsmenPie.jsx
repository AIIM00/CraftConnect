import { assets } from "../assets/assets";

export default function CraftsmenPie() {
  const items = [
    { img: assets.blacksmith },
    { img: assets.plumber },
    { img: assets.electrician },
    { img: assets.painter },
  ];

  return (
    <div className="relative mx-auto h-72 w-72 sm:h-72 sm:w-72 md:h-[28rem] md:w-[28rem]  lg:max-h-[480px] lg:max-w-[480px]">
      {/* Outer glow */}
      <div className="absolute -inset-6 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -bottom-8 left-8 h-36 w-36 rounded-full bg-teal/25 blur-3xl" />
      <div className="absolute -right-8 top-8 h-40 w-40 rounded-full bg-sky/25 blur-3xl" />

      {/* Glass outer frame */}
      <div className="relative h-full w-full rounded-full border border-white/35 bg-white/15 p-3 shadow-glass backdrop-blur-2xl">
        <div className="relative h-full w-full overflow-hidden rounded-full border border-white/30 bg-white/10 shadow-2xl">
          <Slice position="top-0 left-0" img={items[0].img} />
          <Slice position="top-0 right-0" img={items[1].img} />
          <Slice position="bottom-0 left-0" img={items[2].img} />
          <Slice position="bottom-0 right-0" img={items[3].img} />

          {/* Glass shine */}
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/25 via-white/5 to-transparent" />

          {/* Cross divider */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-white/35" />
          <div className="pointer-events-none absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-white/35" />

          {/* Dark soft overlay for better luxury look */}
          <div className="pointer-events-none absolute inset-0 rounded-full bg-primary-dark/10" />
        </div>
      </div>

      {/* Center button / ring */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="z-10 flex h-16 w-16 items-center justify-center rounded-full border-[8px] border-white/70 bg-accent text-primary-dark shadow-glow md:h-20 md:w-20">
          <div className="h-6 w-6 rounded-full bg-primary shadow-inner md:h-8 md:w-8" />
        </div>
      </div>
    </div>
  );
}

function Slice({ position, img }) {
  return (
    <div
      className={`group absolute h-1/2 w-1/2 cursor-pointer overflow-hidden ${position}`}
    >
      <img
        src={img}
        alt=""
        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
      />

      {/* Normal overlay */}
      <div className="absolute inset-0 bg-primary-dark/25 transition duration-500 group-hover:bg-primary-dark/5" />

      {/* Glass hover highlight */}
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="h-full w-full bg-gradient-to-br from-white/25 via-transparent to-accent/15" />
      </div>
    </div>
  );
}
