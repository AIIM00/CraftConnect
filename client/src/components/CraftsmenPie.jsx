import { assets } from "../assets/assets";

export default function CraftsmenPie() {
  const items = [
    { img: assets.blacksmith },
    { img: assets.plumber },
    { img: assets.electrician },
    { img: assets.painter },
  ];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[320px] sm:max-w-[380px] md:max-w-[460px] lg:max-w-[520px]">
      {/* Background Glow */}
      <div className="absolute -inset-8 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -left-6 bottom-8 h-32 w-32 rounded-full bg-secondary/20 blur-3xl sm:h-40 sm:w-40" />
      <div className="absolute -right-6 top-8 h-32 w-32 rounded-full bg-primary/15 blur-3xl sm:h-40 sm:w-40" />

      {/* Outer Circle */}
      <div className="relative h-full w-full rounded-full border border-border-soft bg-card-gradient p-3 shadow-glass sm:p-4">
        {/* Inner Circle */}
        <div className="relative h-full w-full overflow-hidden rounded-full border border-border-soft bg-background shadow-2xl">
          <Slice position="top-0 left-0" img={items[0].img} />

          <Slice position="top-0 right-0" img={items[1].img} />

          <Slice position="bottom-0 left-0" img={items[2].img} />

          <Slice position="bottom-0 right-0" img={items[3].img} />

          {/* Dividers */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-white/60" />

          <div className="pointer-events-none absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-white/60" />

          {/* Glass Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
        </div>
      </div>

      {/* Center Circle */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-[8px] border-background bg-primary-gradient shadow-glass sm:h-20 sm:w-20 md:h-24 md:w-24 md:border-[10px]">
          <div className="h-6 w-6 rounded-full bg-secondary shadow-inner sm:h-8 sm:w-8 md:h-10 md:w-10" />
        </div>
      </div>
    </div>
  );
}

function Slice({ position, img }) {
  return (
    <div className={`group absolute h-1/2 w-1/2 overflow-hidden ${position}`}>
      <img
        src={img}
        alt=""
        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/30 transition duration-500 group-hover:bg-primary/10" />

      {/* Hover Glow */}
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="h-full w-full bg-gradient-to-br from-secondary/20 via-transparent to-primary/20" />
      </div>
    </div>
  );
}
