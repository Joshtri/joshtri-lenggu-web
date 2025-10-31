import { Input } from "@heroui/react";
import { useFormContext, RegisterOptions, Controller } from "react-hook-form";
import { useState, MouseEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

import { FormFieldWrapper } from "../Form/FormFieldWrapper";

interface TextInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  type?: "text" | "password" | "email" | "number" | "tel" | "url";
  validation?: RegisterOptions;
}

export const TextInput = ({
  name,
  label,
  placeholder,
  disabled = false,
  required = true,
  type = "text",
  validation,
}: TextInputProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  // Local state for toggling password visibility
  const [show, setShow] = useState(false);

  const isPassword = type === "password";

  const toggleShow = (e: MouseEvent) => {
    // Prevent the toggle button from submitting forms when inside a form
    e.preventDefault();
    setShow(prev => !prev);
  };

  return (
    <FormFieldWrapper label={label} name={name} required={required}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Input
            {...field}
            endContent={
              isPassword ? (
                <button
                  aria-label={
                    show ? "Sembunyikan password" : "Tampilkan password"
                  }
                  className="inline-flex items-center justify-center p-1"
                  type="button"
                  onClick={toggleShow}
                >
                  {show ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              ) : undefined
            }
            errorMessage={error}
            id={name}
            isDisabled={disabled}
            isInvalid={!!error}
            isRequired={required}
            labelPlacement="outside"
            placeholder={placeholder}
            type={isPassword && show ? "text" : type}
          />
        )}
        rules={validation}
      />
    </FormFieldWrapper>
  );
};
