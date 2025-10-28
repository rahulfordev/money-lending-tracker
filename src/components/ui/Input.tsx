import { InputHTMLAttributes, forwardRef, useState } from "react";
import { clsx } from "clsx";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helper, type, showPasswordToggle, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType =
      showPasswordToggle && type === "password"
        ? showPassword
          ? "text"
          : "password"
        : type;

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={clsx(
              "w-full px-3 py-2 border border-[#E6E6E6] rounded placeholder:text-gray-400 focus:outline-none focus:border-primary transition-colors",
              {
                "border-red-500 focus:border-red-500": error,
                "pr-10": showPasswordToggle && type === "password",
              },
              className
            )}
            {...props}
          />

          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {helper && !error && <p className="text-sm text-gray-500">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
