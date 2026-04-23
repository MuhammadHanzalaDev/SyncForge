import { FastifyRequest } from "fastify";
import type { UploadedFile } from "@/modules/storage/storage.types";

export type MultipartFields = Record<string, string | string[]>;

export type ParsedMultipart = {
  data: MultipartFields;
  files: UploadedFile[];
};

export const parseMultipart = async (
  request: FastifyRequest,
): Promise<ParsedMultipart> => {
  const fields: MultipartFields = {};
  const files: UploadedFile[] = [];

  for await (const part of request.parts()) {
    if (part.type === "file") {
      const buffer = await part.toBuffer();

      files.push({
        fieldname: part.fieldname,
        buffer,
        filename: part.filename,
        mimetype: part.mimetype,
        size: buffer.length,
      });
    } else {
      if (fields[part.fieldname]) {
        if (!Array.isArray(fields[part.fieldname])) {
          fields[part.fieldname] = [fields[part.fieldname] as string];
        }

        (fields[part.fieldname] as string[]).push(part.value as string);
      } else {
        fields[part.fieldname] = part.value as string;
      }
    }
  }

  return {
    data: fields,
    files,
  };
};
