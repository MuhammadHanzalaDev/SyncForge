"use client";

import {
  CustomFormField,
  FormDialog,
  ProfileUploader,
} from "@/shared/components";
import { UpdateProfileValues } from "../user.types";
import { setProfileSchema } from "../user.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { objectToFormData } from "@/shared/utils/formData";
import { useUpdateProfile } from "../user.mutation";

interface UpdateProfileProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  data: UpdateProfileValues;
}

const UpdateProfile = ({ isOpen, setIsOpen, data }: UpdateProfileProps) => {
  const { mutate, isPending } = useUpdateProfile();
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<UpdateProfileValues>({
    resolver: zodResolver(setProfileSchema),
    defaultValues: {
      firstName: data.firstName,
      lastName: data.lastName,
    },
  });

  const handleSubmit = (values: UpdateProfileValues) => {
    const obj = {
      ...values,
      ...(file ? { file } : {}),
    };
    const data = objectToFormData(obj);
    mutate(data, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };

  return (
    <FormDialog
      title="Profile Setup"
      description="Setup your SyncForge profile."
      open={isOpen}
      onOpenChange={setIsOpen}
      form={form}
      onSubmit={handleSubmit}
      submitBtnText="Save"
      isSubmitting={isPending}
      isCancelBtn={false}
      isClosable={false}
    >
      <ProfileUploader
        fallback="Profile Image"
        value={file}
        onChange={(value) => setFile(value)}
      />

      <div className="mt-3">
        <CustomFormField
          name="firstName"
          label="First Name"
          type="text"
          placeholder="Enter your firstname"
        />
      </div>

      <div className="mt-3">
        <CustomFormField
          name="lastName"
          label="Last Name"
          type="text"
          placeholder="Enter your lastname"
        />
      </div>
    </FormDialog>
  );
};

export default UpdateProfile;
