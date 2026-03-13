import { CustomFormField } from "@/shared/components";
import { CreateWorkSpaceValues } from "../../workspace.types";
import { createWorkSpaceSchema } from "../../workspace.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const CreateWorkSpace = () => {
  const form = useForm<CreateWorkSpaceValues>({
    resolver: zodResolver(createWorkSpaceSchema),
    defaultValues: {
      name: "",
      emails: [],
    },
  });
  return <div>CreateWorkSpace</div>;
};

export default CreateWorkSpace;
