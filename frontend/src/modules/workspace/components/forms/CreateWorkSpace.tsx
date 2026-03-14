"use client";

import {
  CustomFormField,
  CustomInputField,
  FormDialog,
  ProfileUploader,
} from "@/shared/components";
import { CreateWorkSpaceValues } from "../../workspace.types";
import { createWorkSpaceSchema, emailSchema } from "../../workspace.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { X } from "lucide-react";

interface CreateWorkSpaceProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const CreateWorkSpace = ({ isOpen, setIsOpen }: CreateWorkSpaceProps) => {
  const [email, setEmail] = useState("");

  const form = useForm<CreateWorkSpaceValues>({
    resolver: zodResolver(createWorkSpaceSchema),
    defaultValues: {
      name: "",
      emails: [],
    },
  });
  const errors = form.formState.errors;

  const emails = form.watch("emails");

  const addEmail = () => {
    const trimmed = email.trim();

    if (!trimmed) return;

    const result = emailSchema.safeParse(trimmed);

    if (!result.success) {
      form.setError("emails", {
        type: "manual",
        message: "Please enter a valid email address",
      });
      return;
    }

    if (emails.includes(trimmed)) return;

    form.setValue("emails", [...emails, trimmed]);
    setEmail("");
    form.clearErrors("emails");
  };
  const removeEmail = (emailToRemove: string) => {
    form.setValue(
      "emails",
      emails.filter((e) => e !== emailToRemove),
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  return (
    <FormDialog
      title="Create Workspace"
      description="Name your workspace and invite team members to collaborate seamlessly."
      open={isOpen}
      onOpenChange={setIsOpen}
      form={form}
      onSubmit={(data) => console.log(data)}
    >
      <ProfileUploader fallback="Workspace avatar"/>

      <div className="mt-3">
        <CustomFormField
          name="name"
          label="Workspace Name"
          type="text"
          placeholder="Name your workspace..."
        />
      </div>

      <div className="mt-3">
        <CustomInputField
          name="email"
          label="Invite"
          type="text"
          placeholder="Enter email..."
          description="Type the team member's email address and press enter key."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          error={errors.emails?.message}
        />
      </div>

      {/* Selected Emails */}
      {emails.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 max-h-48 overflow-auto">
          {emails.map((email) => (
            <Badge
              key={email}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              {email}

              <button
                type="button"
                onClick={() => removeEmail(email)}
                className="ml-1 hover:text-destructive"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </FormDialog>
  );
};

export default CreateWorkSpace;
