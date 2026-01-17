import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  register: UseFormRegisterReturn;
}

const InputField = ({
  label,
  type = "text",
  placeholder,
  error,
  register,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = register.name;

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1 relative">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          placeholder={placeholder}
          {...register}
          className={`placeholder-gray-400 w-full rounded border p-2 pr-10 text-sm focus:outline-none focus:ring-1
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-gray-900 focus:ring-gray-900"
            }
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <span id={`${inputId}-error`} className="text-sm text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
