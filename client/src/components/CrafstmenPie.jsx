import { assets } from "../assets/assets";

export default function CraftsmenPie() {
  const items = [
    { img: assets.blacksmith },
    { img: assets.plumber },
    { img: assets.electrician },
    { img: assets.painter },
  ];

  return (
    <div className="relative w-72 h-72 sm:w-72 sm:h-72 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] mx-auto">
      <div className="w-full h-full rounded-full overflow-hidden relative border border-gray-200 shadow-lg">
        <Slice position="top-0 left-0" img={items[0].img} />
        <Slice position="top-0 right-0" img={items[1].img} />
        <Slice position="bottom-0 left-0" img={items[2].img} />
        <Slice position="bottom-0 right-0" img={items[3].img} />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary rounded-full border-8 flex items-center justify-center text-white text-xl md:text-2xl shadow-xl z-10"></div>
      </div>
    </div>
  );
}

function Slice({ position, img }) {
  return (
    <div
      className={`absolute w-1/2 h-1/2 ${position} overflow-hidden group cursor-pointer`}
    >
      <img
        src={img}
        alt=""
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition duration-300" />
    </div>
  );
}
