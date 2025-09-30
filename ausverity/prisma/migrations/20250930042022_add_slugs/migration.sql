/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `LawFirm` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Lawyer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `LawFirm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Lawyer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."InquiryStatus" AS ENUM ('NEW', 'READ', 'RESPONDED', 'CLOSED', 'SPAM');

-- AlterTable
ALTER TABLE "public"."LawFirm" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Lawyer" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."ContactInquiry" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "caseType" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "preferredContact" TEXT NOT NULL,
    "recipientType" "public"."TargetType" NOT NULL,
    "recipientId" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "firmName" TEXT,
    "status" "public"."InquiryStatus" NOT NULL DEFAULT 'NEW',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactInquiry_recipientType_recipientId_idx" ON "public"."ContactInquiry"("recipientType", "recipientId");

-- CreateIndex
CREATE INDEX "ContactInquiry_status_idx" ON "public"."ContactInquiry"("status");

-- CreateIndex
CREATE INDEX "ContactInquiry_createdAt_idx" ON "public"."ContactInquiry"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "LawFirm_slug_key" ON "public"."LawFirm"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Lawyer_slug_key" ON "public"."Lawyer"("slug");
