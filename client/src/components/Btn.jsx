import React from "react";

const Btn = ({
  type = "button",
  children,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  iconOnly = false,
}) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold
    transition-all duration-250 ease-smooth
    focus:outline-none focus:ring-4
    active:scale-[0.98]
    disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60
    select-none
  `;

  const sizes = {
    sm: iconOnly ? "h-9 w-9 rounded-lg" : "h-9 px-4 rounded-lg text-sm",
    md: iconOnly ? "h-11 w-11 rounded-xl" : "h-11 px-5 rounded-xl text-sm",
    lg: iconOnly ? "h-12 w-12 rounded-xl" : "h-12 px-6 rounded-xl text-base",
  };

  const variants = {
    primary: `
      border border-transparent
      bg-primary-gradient text-white
      shadow-card
      hover:scale-[1.01]
      hover:shadow-elevated
      focus:ring-primary/20
    `,

    secondary: `
      border border-transparent
      bg-secondary-gradient text-white
      shadow-card
      hover:scale-[1.01]
      hover:shadow-elevated
      focus:ring-secondary/25
    `,

    outline: `
      border border-border-soft
      bg-background text-primary
      shadow-soft
      hover:border-primary/30
      hover:bg-background-light
      hover:text-primary-hover
      focus:ring-primary/10
    `,

    ghost: `
      border border-transparent
      bg-transparent text-primary
      shadow-none
      hover:bg-primary/5
      hover:text-primary-hover
      focus:ring-primary/10
    `,

    soft: `
      border border-border-soft
      bg-background-light text-primary
      shadow-soft
      hover:bg-background
      hover:text-primary-hover
      focus:ring-primary/10
    `,

    surface: `
      border border-border-soft
      bg-background text-text
      shadow-soft
      hover:bg-background-light
      hover:text-primary
      focus:ring-primary/10
    `,

    success: `
      border border-success
      bg-success text-white
      shadow-soft
      hover:brightness-95
      focus:ring-success/20
    `,

    warning: `
      border border-warning
      bg-warning text-white
      shadow-soft
      hover:brightness-95
      focus:ring-warning/20
    `,

    danger: `
      border border-danger
      bg-danger text-white
      shadow-soft
      hover:brightness-95
      focus:ring-danger/20
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${sizes[size] || sizes.md}
        ${variants[variant] || variants.primary}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}

      {iconOnly ? !loading && children : children}
    </button>
  );
};

export default Btn;
