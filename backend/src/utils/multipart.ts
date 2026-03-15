import { FastifyRequest } from "fastify";

export const parseMultipart = async (request: FastifyRequest) => {
  const fields: Record<string, any> = {};
  const files: Array<{
    buffer: Buffer;
    filename: string;
    mimetype: string;
    size: number;
  }> = [];

  for await (const part of request.parts()) {
    if (part.type === "file") {
      const buffer = await part.toBuffer();

      files.push({
        buffer,
        filename: part.filename,
        mimetype: part.mimetype,
        size: buffer.length, // correct way
      });
    } else {
      if (fields[part.fieldname]) {
        if (!Array.isArray(fields[part.fieldname])) {
          fields[part.fieldname] = [fields[part.fieldname]];
        }
        fields[part.fieldname].push(part.value);
      } else {
        fields[part.fieldname] = part.value;
      }
    }
  }

  return {
    ...fields,
    ...(files?.length > 1
      ? { files }
      : files?.length === 1
        ? { file: files[0] }
        : {}),
  };
};
