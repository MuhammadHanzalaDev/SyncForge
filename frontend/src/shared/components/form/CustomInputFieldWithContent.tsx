"use client";
import { Field, FieldLabel, FieldDescription, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/shared/components/ui/input-group";

interface CustomInputProps {
  name?: string;
  label?: string;
  type: string;
  placeholder?: string;
  description?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string | undefined | null;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

const CustomInputFieldWithContent = ({
  name,
  label,
  type,
  placeholder,
  description,
  value,
  onChange,
  error,
  leftContent,
  rightContent,
  ...props
}: CustomInputProps) => {
  return (
    <Field data-invalid={!!error}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}

      <InputGroup>
        <InputGroupInput
          id={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
        {leftContent && <InputGroupAddon>{leftContent}</InputGroupAddon>}
        {rightContent && (
          <InputGroupAddon align="inline-end">{rightContent}</InputGroupAddon>
        )}
      </InputGroup>

      {description && <FieldDescription>{description}</FieldDescription>}

      {error && <FieldError errors={[{ message: error }]} />}
    </Field>
  );
};

export default CustomInputFieldWithContent;
