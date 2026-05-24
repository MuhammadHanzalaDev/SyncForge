import { z } from "zod";

const createRoomSchema = z
  .object({
    name: z.string().min(3, "name must be atleast 3 characters."),

    type: z.enum(["PUBLIC", "PRIVATE", "DIRECT"], {
      errorMap: () => ({
        message: "Please select a room type",
      }),
    }),

    memberIds: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.type === "PRIVATE" &&
      (!data.memberIds || data.memberIds.length < 1)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["memberIds"],
        message: "Please select at least one member",
      });
    }
  });

export { createRoomSchema };
