import s3 from "@/config/s3";
import { env } from "@/config/env";
import { randomUUID } from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

async function uploadFile(file: any, visibility: "PUBLIC" | "PRIVATE") {
  const key = `${visibility.toLowerCase()}/${randomUUID()}-${file.filename}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: env.AWS_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
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

async function getTemporaryUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: env.AWS_BUCKET,
    Key: key,
  });

  return getSignedUrl(s3, command, { expiresIn: 300 });
}

async function getFileUrl(file: any) {
  if (file.visibility === "PUBLIC") {
    return `https://${env.AWS_BUCKET}.s3.amazonaws.com/${file.key}`;
  }

  return getTemporaryUrl(file.key);
}

export { uploadFile, deleteFile, getFileUrl };
