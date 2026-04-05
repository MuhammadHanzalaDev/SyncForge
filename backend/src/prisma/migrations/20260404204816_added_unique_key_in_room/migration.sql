/*
  Warnings:

  - A unique constraint covering the columns `[uniqueKey]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "uniqueKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Room_uniqueKey_key" ON "Room"("uniqueKey");
