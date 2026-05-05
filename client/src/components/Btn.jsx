import React from "react";

const Btn = ({ type, onClick, children, className, variant = "primary" }) => {
  const base =
    "flex items-center justify-center rounded-full px-4 py-2 transition-all duration-200";
  const variants = {
    primary: "bg-accent text-white hover:bg-accent-hover",
    outline:
      "border border-primary text-text-muted hover:bg-primary hover:text-white",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className} || ""`}
    >
      {children}
    </button>
  );
};

export default Btn;
