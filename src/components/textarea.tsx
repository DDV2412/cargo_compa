import React from "react";

interface TextFieldProps {
  label?: string;
  ariaLabel: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  id?: string;
  name?: string;
  style?: string;
  labelClassName?: string;
}
const Textarea = ({
  label,
  ariaLabel,
  placeholder,
  value,
  onChange,
  disabled,
  error,
  className,
  autoComplete,
  autoFocus,
  id,
  name,
  style,
  labelClassName,
}: TextFieldProps) => {
  return (
    <div className="w-full flex flex-col justify-start items-start gap-2">
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium ${
            style === "secondary" ? "text-white" : ""
          } ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        <textarea
          id={id}
          name={name}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`block w-full shadow-sm sm:text-sm rounded-sm min-h-12 bg-transparent border focus:outline-none px-4 py-2.5 ${
            style === "secondary"
              ? "border-neutral-100/30 text-white placeholder:text-neutral-300 focus:border-neutral-300"
              : "border-neutral-300/30 text-neutral-900 dark:text-white placeholder-text-neutral-500 focus:border-blue-500"
          } ${error ? "border-red-300" : ""} ${className}`}
          placeholder={placeholder}
          aria-label={ariaLabel}
          autoFocus={autoFocus}
          rows={10}
        />
      </div>
      {error && (
        <p
          className={`text-xs pl-4 ${
            style === "secondary" ? "text-red-100" : "text-red-500"
          }`}
          id="email-error"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Textarea;
