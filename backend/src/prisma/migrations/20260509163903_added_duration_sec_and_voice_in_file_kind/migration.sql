-- AlterEnum
ALTER TYPE "FileKind" ADD VALUE 'VOICE';

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "durationSec" INTEGER;
