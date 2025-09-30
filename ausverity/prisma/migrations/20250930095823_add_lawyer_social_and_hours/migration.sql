-- AlterTable
ALTER TABLE "public"."Lawyer" ADD COLUMN     "facebookUrl" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "operatingHours" JSONB,
ADD COLUMN     "twitterUrl" TEXT,
ADD COLUMN     "websiteUrl" TEXT;
