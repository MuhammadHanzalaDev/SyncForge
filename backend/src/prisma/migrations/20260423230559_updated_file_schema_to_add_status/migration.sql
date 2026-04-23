/*
  Warnings:

  - You are about to drop the `_MessageFiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('PENDING', 'ATTACHED');

-- DropForeignKey
ALTER TABLE "_MessageFiles" DROP CONSTRAINT "_MessageFiles_A_fkey";

-- DropForeignKey
ALTER TABLE "_MessageFiles" DROP CONSTRAINT "_MessageFiles_B_fkey";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "messageId" TEXT,
ADD COLUMN     "status" "FileStatus" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "_MessageFiles";

-- CreateIndex
CREATE INDEX "File_messageId_idx" ON "File"("messageId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
