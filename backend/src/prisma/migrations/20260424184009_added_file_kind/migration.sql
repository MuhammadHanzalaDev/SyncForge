-- CreateEnum
CREATE TYPE "FileKind" AS ENUM ('IMAGE', 'FILE');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "kind" "FileKind" NOT NULL DEFAULT 'FILE';
