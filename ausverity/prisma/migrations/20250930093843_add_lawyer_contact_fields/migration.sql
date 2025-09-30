-- AlterTable
ALTER TABLE "public"."Lawyer" ADD COLUMN     "displayEmail" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "displayPhone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT;
