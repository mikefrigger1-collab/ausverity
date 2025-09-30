-- AlterTable
ALTER TABLE "public"."LawFirm" ADD COLUMN     "displayEmail" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "displayPhone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "galleryImages" JSONB,
ADD COLUMN     "isPaidUser" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "operatingHours" JSONB;

-- CreateTable
CREATE TABLE "public"."FirmCourtAppearance" (
    "id" TEXT NOT NULL,
    "firmId" TEXT NOT NULL,
    "courtName" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "appearanceCount" TEXT NOT NULL,

    CONSTRAINT "FirmCourtAppearance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FirmLanguage" (
    "id" TEXT NOT NULL,
    "firmId" TEXT NOT NULL,
    "languageName" TEXT NOT NULL,
    "proficiencyLevel" TEXT NOT NULL,

    CONSTRAINT "FirmLanguage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."FirmCourtAppearance" ADD CONSTRAINT "FirmCourtAppearance_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "public"."LawFirm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FirmLanguage" ADD CONSTRAINT "FirmLanguage_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "public"."LawFirm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
