import React from "react";

const Btn = ({
  type = "button",
  onClick,
  children,
  className = "",
  variant = "primary",
  disabled = false,
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold backdrop-blur-md shadow-[0_0_18px_rgba(255,255,255,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(255,255,255,0.25)]";

  const variants = {
    primary:
      "border-cyan-300/50 bg-cyan-400/15 text-text-muted hover:bg-cyan-400/25 hover:shadow-cyan-400/30",
    outline:
      "border-violet-300/50 bg-violet-400/15 text-violet-100 hover:bg-violet-400/25 hover:shadow-violet-400/30",
    secondary:
      "border-gray-300/40 bg-gray-400/15 text-gray-100 hover:bg-gray-400/25 hover:shadow-gray-400/30",
    success:
      "border-green-300/50 bg-green-400/15 text-green-100 hover:bg-green-400/25 hover:shadow-green-400/30",
    warning:
      "border-yellow-300/50 bg-yellow-400/15 text-yellow-100 hover:bg-yellow-400/25 hover:shadow-yellow-400/30",
    danger:
      "border-red-300/50 bg-red-400/15 text-red-100 hover:bg-red-400/25 hover:shadow-red-400/30",
    ghost:
      "border-transparent bg-transparent text-primary shadow-none hover:bg-transparent hover:text-primary-light hover:shadow-none",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
};

export default Btn;
