"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Field, FieldLabel, FieldDescription, FieldError } from "../ui/field";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

type SelectOption = {
  label: string;
  value: string;
};

interface CustomSelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  options: SelectOption[];
}

const CustomSelectField = ({
  name,
  label,
  placeholder,
  description,
  options,
}: CustomSelectFieldProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors[name]?.message as string | undefined;

  return (
    <Field data-invalid={!!fieldError}>
      {label && <FieldLabel>{label}</FieldLabel>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {description && <FieldDescription>{description}</FieldDescription>}

      {fieldError && <FieldError errors={[{ message: fieldError }]} />}
    </Field>
  );
};

export default CustomSelectField;
