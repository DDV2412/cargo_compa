import React from "react";

interface CheckboxProps {
  label: React.ReactNode;
  ariaLabel: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  id?: string;
  name?: string;
  style?: string;
}
const Checkbox = ({
  label,
  ariaLabel,
  checked,
  onChange,
  disabled,
  error,
  className,
  id,
  name,
  style,
}: CheckboxProps) => {
  return (
    <div className="flex flex-col justify-start items-start gap-2">
      <div className="flex justify-start items-center gap-2">
        <input
          type="checkbox"
          id={id}
          name={name}
          aria-label={ariaLabel}
          onChange={onChange}
          disabled={disabled}
          checked={checked}
          className={`w-4 h-4 border border-neutral-300 rounded-[4px] appearance-none checked:bg-[url('/images/check.svg')] bg-center bg-no-repeat bg-contain ${className}`}
        />
        <label htmlFor={id} className={`block text-sm font-medium`}>
          {label}
        </label>
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

export default Checkbox;
