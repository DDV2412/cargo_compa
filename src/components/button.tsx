import Link from "next/link";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type: "button" | "submit" | "reset" | "link";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style: "primary" | "secondary" | "text";
  href?: string;
  ariaLabel: string;
}
const Button = ({
  children,
  onClick,
  type,
  className,
  disabled,
  loading,
  icon,
  style,
  href,
  ariaLabel,
}: ButtonProps) => {
  return (
    <>
      {type === "link" ? (
        <Link href={href ?? ""} aria-label={ariaLabel} className={className}>
          {children}
        </Link>
      ) : (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled || loading}
          aria-label={ariaLabel}
          className={`flex cursor-pointer items-center justify-center px-4 py-2.5 rounded-lg font-semibold ${
            (style === "primary" && "bg-blue-500 text-white") ||
            (style === "secondary" &&
              "bg-white text-neutral-900 border border-neutral-300") ||
            (style === "text" && "!p-0 !m-0 !text-blue-500 !inline-flex")
          } ${className}`}
        >
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </button>
      )}
    </>
  );
};

export default Button;
