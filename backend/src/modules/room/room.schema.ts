import * as z from "zod";

const createRoomSchema = z
  .object({
    workspaceId: z.string(),

    name: z.string().min(3, "name must be atleast 3 characters."),

    type: z.enum(["PUBLIC", "PRIVATE", "DIRECT"], {
      message: "Please select a room type",
    }),

    memberIds: z.preprocess((value) => {
      if (value === undefined) return [];

      return Array.isArray(value) ? value : [value];
    }, z.array(z.string())),
  })
  .superRefine((data, ctx) => {
    if (
      data.type === "PRIVATE" &&
      (!data.memberIds || data.memberIds.length < 1)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["memberIds"],
        message: "Please select at least one member",
      });
    }
  });

export { createRoomSchema };
