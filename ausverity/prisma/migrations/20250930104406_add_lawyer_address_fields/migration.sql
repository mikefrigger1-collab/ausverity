-- AlterTable
ALTER TABLE "public"."Lawyer" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT DEFAULT 'Australia',
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "postcode" TEXT,
ADD COLUMN     "state" TEXT;
