"use client";

import { useFormContext } from "react-hook-form";
import { Field, FieldLabel, FieldDescription, FieldError } from "../field";
import { Input } from "../input";

interface CustomFieldProps {
  name: string;
  label?: string;
  type: string;
  placeholder?: string;
  description?: string;
}

const CustomFormField = ({
  name,
  label,
  type,
  placeholder,
  description,
}: CustomFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors[name]?.message as string | undefined;

  return (
    <Field data-invalid={!!fieldError}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}

      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
      />

      {description && <FieldDescription>{description}</FieldDescription>}

      {fieldError && <FieldError errors={[{ message: fieldError }]} />}
    </Field>
  );
};

export default CustomFormField;
