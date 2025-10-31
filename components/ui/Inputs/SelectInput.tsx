"use client";

import { Select, SelectItem } from "@heroui/react";
import { Controller, useFormContext } from "react-hook-form";

import { FormFieldWrapper } from "../Form/FormFieldWrapper";

interface SelectOption {
  label: string;
  value: string;
  description?: string;
}

interface SelectInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  options: SelectOption[];
  description?: string;
  selectionMode?: "single" | "multiple";
  disallowEmptySelection?: boolean;
}

export const SelectInput = ({
  name,
  label,
  placeholder = "Pilih opsi...",
  disabled = false,
  required = true,
  options,
  description,
  selectionMode = "single",
  disallowEmptySelection = false,
}: SelectInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors?.[name]?.message as string | undefined;

  return (
    <FormFieldWrapper
      key={name}
      helperText={description}
      label={label}
      name={name}
      required={required}
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          // Convert field value to selection keys
          // Always provide a Set to avoid uncontrolled-to-controlled warning
          let selectedKeys: Set<string>;

          if (selectionMode === "multiple") {
            selectedKeys = new Set(field.value ?? []);
          } else {
            selectedKeys = new Set(field.value ? [String(field.value)] : []);
          }

          return (
            <Select
              aria-label={label}
              disallowEmptySelection={disallowEmptySelection}
              errorMessage={error}
              isDisabled={disabled}
              isInvalid={!!error}
              labelPlacement="outside"
              // isRequired={required}
              // label={placeholder}
              placeholder={placeholder}
              selectedKeys={selectedKeys}
              selectionMode={selectionMode}
              onSelectionChange={(keys: "all" | Set<React.Key>) => {
                const keyArray: string[] = Array.from(keys as Set<string>);

                if (selectionMode === "multiple") {
                  field.onChange(keyArray);
                } else {
                  field.onChange(keyArray[0] || null);
                }
              }}
            >
              {options.map((option: SelectOption) => (
                <SelectItem key={option.value}>{option.label}</SelectItem>
              ))}
            </Select>
          );
        }}
      />
    </FormFieldWrapper>
  );
};
