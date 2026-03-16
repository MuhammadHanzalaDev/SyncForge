import s3 from "@/config/s3";
import { env } from "@/config/env";
import { randomUUID } from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ApiError } from "@/utils/Error";
import prisma from "@/config/prisma";

async function uploadFile(
  file: any,
  folder: "avatars" | "attachments" | "documents",
) {
  const key = `${folder}/${randomUUID()}-${file.filename}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: env.AWS_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ContentDisposition: "inline",
    }),
  );

  return key;
}

async function deleteFile(key: string) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: env.AWS_BUCKET,
      Key: key,
    }),
  );
}

async function getFileUrl(fileId: string) {
  if (!fileId) {
    throw new ApiError("File Id is required", 500);
  }
  const file = await prisma.file.findUnique({
    where: { id: fileId },
    select: { key: true },
  });

  if (!file) throw new ApiError("File not found", 404);

  const command = new GetObjectCommand({
    Bucket: env.AWS_BUCKET,
    Key: file.key,
  });

  return await getSignedUrl(s3, command, { expiresIn: 3600 });
}

export { uploadFile, deleteFile, getFileUrl };
