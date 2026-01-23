import { UseFormRegisterReturn } from "react-hook-form";

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
  const inputId = register.name;

  return (
    <div className="flex flex-col gap-1 relative">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        {...register}
        className={`placeholder-gray-400 text-black w-full rounded border p-2 text-sm focus:outline-none focus:ring-1
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-gray-900 focus:ring-gray-900"
          }
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />

      {error && (
        <span id={`${inputId}-error`} className="text-sm text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
