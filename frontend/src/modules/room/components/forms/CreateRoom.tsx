"use client";

import {
  CustomFormField,
  CustomSelectField,
  FormDialog,
  ProfileUploader,
} from "@/shared/components";
import { CreateRoomValues } from "../../room.types";
import { createRoomSchema } from "../../room.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { X } from "lucide-react";
import { useCreateRoom } from "../../room.mutation";
import { objectToFormData } from "@/shared/utils/formData";
import { roomTypeOptions } from "../../room.content";

interface CreateWorkSpaceProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const CreateRoom = ({ isOpen, setIsOpen }: CreateWorkSpaceProps) => {
  const { mutate, isPending } = useCreateRoom();
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<CreateRoomValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      memberIds: [],
    },
  });
  const errors = form.formState.errors;

  const handleSubmit = (values: CreateRoomValues) => {
    const obj = {
      ...values,
      ...(file ? { file } : {}),
    };
    const data = objectToFormData(obj);
    mutate(data, {
      onSuccess: (data) => {
        console.log("room created", data);
        setIsOpen(false);
      },
    });
  };

  return (
    <FormDialog
      title="Create Room"
      description="Name the room and select the users."
      open={isOpen}
      onOpenChange={setIsOpen}
      form={form}
      onSubmit={handleSubmit}
      submitBtnText="Create"
      isSubmitting={isPending}
    >
      <ProfileUploader
        fallback="Room Avatar"
        value={file}
        onChange={(value) => setFile(value)}
      />

      <div className="mt-3">
        <CustomFormField
          name="name"
          label="Room Name"
          type="text"
          placeholder="Name the room..."
        />
      </div>

      <div className="mt-3">
        <CustomSelectField
          name="type"
          label="Room Type"
          placeholder="Select room type"
          options={roomTypeOptions}
        />
      </div>
    </FormDialog>
  );
};

export default CreateRoom;
