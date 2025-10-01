-- AlterTable
ALTER TABLE "public"."CourtAppearance" ALTER COLUMN "appearanceCount" DROP DEFAULT,
ALTER COLUMN "appearanceCount" SET DATA TYPE TEXT;
