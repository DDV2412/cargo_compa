import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import React from "react";

interface TextFieldProps {
  label?: string;
  ariaLabel: string;
  type: "text" | "password" | "email";
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
const TextField = ({
  label,
  ariaLabel,
  type,
  placeholder,
  value,
  onChange,
  disabled,
  error,
  className,
  autoComplete,
  labelClassName,
  autoFocus,
  id,
  name,
  style,
}: TextFieldProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

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
        <input
          type={isPasswordVisible ? "text" : type}
          id={id}
          name={name}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`block w-full shadow-sm sm:text-sm rounded-lg min-h-12 bg-transparent border focus:outline-none px-4 py-2.5 border-neutral-300 text-neutral-900 dark:text-white placeholder-text-neutral-500 focus:border-blue-500 ${
            error ? "border-red-300" : ""
          } ${className}`}
          placeholder={placeholder}
          aria-label={ariaLabel}
          autoFocus={autoFocus}
        />
        {type === "password" && (
          <div
            className="absolute right-3 top-3 text-white cursor-pointer"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? <IconEye /> : <IconEyeClosed />}
          </div>
        )}
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

export default TextField;
