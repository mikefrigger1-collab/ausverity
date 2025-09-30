-- AlterTable
ALTER TABLE "public"."LawFirm" ALTER COLUMN "slug" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Lawyer" ALTER COLUMN "slug" DROP NOT NULL;
