"use client";
import { Field, FieldLabel, FieldDescription, FieldError } from "../ui/field";
import { Input } from "../ui/input";

interface CustomInputProps {
  name?: string;
  label?: string;
  type: string;
  placeholder?: string;
  description?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string | undefined | null;
}

const CustomFormField = ({
  name,
  label,
  type,
  placeholder,
  description,
  value,
  onChange,
  error,
  ...props
}: CustomInputProps) => {
  return (
    <Field data-invalid={!!error}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}

      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />

      {description && <FieldDescription>{description}</FieldDescription>}

      {error && <FieldError errors={[{ message: error }]} />}
    </Field>
  );
};

export default CustomFormField;
