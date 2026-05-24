"use client";

import { ChevronsUpDown } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/shared/components/ui/field";

type Option = {
  label: string;
  value: string;
};

interface CustomMultiSelectFieldProps {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  options: Option[];
}

const CustomMultiSelectField = ({
  name,
  label,
  description,
  placeholder = "Select options...",
  options,
}: CustomMultiSelectFieldProps) => {
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
        render={({ field }) => {
          const selectedValues: string[] = field.value || [];

          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  role="combobox"
                  variant="outline"
                  className="w-full justify-between"
                >
                  {selectedValues.length > 0
                    ? `${selectedValues.length} selected`
                    : placeholder}

                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search..." />

                  <CommandList>
                    <CommandEmpty>No option found.</CommandEmpty>

                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={(currentValue) => {
                            const updatedValues = selectedValues.includes(
                              currentValue,
                            )
                              ? selectedValues.filter((v) => v !== currentValue)
                              : [...selectedValues, currentValue];

                            field.onChange(updatedValues);
                          }}
                        >
                          <Checkbox
                            checked={selectedValues.includes(option.value)}
                            className="mr-2"
                          />

                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          );
        }}
      />

      {description && <FieldDescription>{description}</FieldDescription>}

      {fieldError && <FieldError errors={[{ message: fieldError }]} />}
    </Field>
  );
};

export default CustomMultiSelectField;
