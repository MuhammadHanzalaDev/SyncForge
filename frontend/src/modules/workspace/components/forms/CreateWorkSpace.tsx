"use client";
import { CustomFormField } from "@/shared/components";
import { CreateWorkSpaceValues } from "../../workspace.types";
import { createWorkSpaceSchema } from "../../workspace.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormDialog } from "@/shared/components";

interface CreateWorkSpaceProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const CreateWorkSpace = ({ isOpen, setIsOpen }: CreateWorkSpaceProps) => {
  const form = useForm<CreateWorkSpaceValues>({
    resolver: zodResolver(createWorkSpaceSchema),
    defaultValues: {
      name: "",
      emails: [],
    },
  });
  return (
    <FormDialog
      title="Create Workspace"
      open={isOpen}
      onOpenChange={setIsOpen}
      form={form}
      onSubmit={() => {}}
    >
      <CustomFormField name="name" label="Name Your Workspace" type="text" />
    </FormDialog>
  );
};

export default CreateWorkSpace;
