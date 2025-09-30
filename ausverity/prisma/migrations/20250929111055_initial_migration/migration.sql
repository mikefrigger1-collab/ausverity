-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'FIRM_OWNER', 'LAWYER', 'LAWYER_FIRM_OWNER', 'CLIENT');

-- CreateEnum
CREATE TYPE "public"."ProfileStatus" AS ENUM ('DRAFT', 'PENDING', 'PUBLISHED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."TargetType" AS ENUM ('LAWYER', 'FIRM');

-- CreateEnum
CREATE TYPE "public"."ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED');

-- CreateEnum
CREATE TYPE "public"."InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."EntityType" AS ENUM ('LAWYER', 'FIRM', 'REVIEW');

-- CreateEnum
CREATE TYPE "public"."ChangeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."PlanType" AS ENUM ('FREE', 'PROFESSIONAL', 'PREMIUM');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED', 'INCOMPLETE', 'TRIALING');

-- CreateEnum
CREATE TYPE "public"."BoostType" AS ENUM ('FEATURED_HOMEPAGE', 'PRIORITY_SEARCH', 'CATEGORY_SPOTLIGHT');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT,
    "name" TEXT,
    "image" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LawFirm" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "logoUrl" TEXT,
    "status" "public"."ProfileStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LawFirm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FirmLocation" (
    "id" TEXT NOT NULL,
    "firmId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Australia',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "FirmLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lawyer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firmId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "bio" TEXT,
    "photoUrl" TEXT,
    "position" TEXT,
    "yearsExperience" INTEGER,
    "status" "public"."ProfileStatus" NOT NULL DEFAULT 'DRAFT',
    "claimedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lawyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Specialisation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "category" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT,

    CONSTRAINT "Specialisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LawyerSpecialisation" (
    "id" TEXT NOT NULL,
    "lawyerId" TEXT NOT NULL,
    "specialisationId" TEXT NOT NULL,
    "yearsExperience" INTEGER,
    "certificationLevel" TEXT,

    CONSTRAINT "LawyerSpecialisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FirmPracticeArea" (
    "id" TEXT NOT NULL,
    "firmId" TEXT NOT NULL,
    "specialisationId" TEXT NOT NULL,

    CONSTRAINT "FirmPracticeArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourtAppearance" (
    "id" TEXT NOT NULL,
    "lawyerId" TEXT NOT NULL,
    "courtName" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "appearanceCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CourtAppearance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LawyerLanguage" (
    "id" TEXT NOT NULL,
    "lawyerId" TEXT NOT NULL,
    "languageName" TEXT NOT NULL,
    "proficiencyLevel" TEXT NOT NULL,

    CONSTRAINT "LawyerLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Certification" (
    "id" TEXT NOT NULL,
    "lawyerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuingBody" TEXT NOT NULL,
    "dateEarned" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "targetType" "public"."TargetType" NOT NULL,
    "lawyerId" TEXT,
    "firmId" TEXT,
    "communicationRating" INTEGER NOT NULL,
    "expertiseRating" INTEGER NOT NULL,
    "valueRating" INTEGER NOT NULL,
    "outcomeRating" INTEGER,
    "overallRating" DOUBLE PRECISION NOT NULL,
    "comment" TEXT NOT NULL,
    "caseReference" TEXT,
    "caseType" TEXT,
    "serviceDate" TIMESTAMP(3),
    "status" "public"."ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReviewResponse" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "responderId" TEXT NOT NULL,
    "responseText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FirmInvitation" (
    "id" TEXT NOT NULL,
    "firmId" TEXT NOT NULL,
    "lawyerId" TEXT NOT NULL,
    "invitedBy" TEXT NOT NULL,
    "status" "public"."InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FirmInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LawyerRequest" (
    "id" TEXT NOT NULL,
    "lawyerId" TEXT NOT NULL,
    "firmId" TEXT NOT NULL,
    "message" TEXT,
    "status" "public"."InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LawyerRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RelationshipHistory" (
    "id" TEXT NOT NULL,
    "lawyerId" TEXT NOT NULL,
    "firmId" TEXT NOT NULL,
    "role" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "RelationshipHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PendingChange" (
    "id" TEXT NOT NULL,
    "entityType" "public"."EntityType" NOT NULL,
    "lawyerId" TEXT,
    "firmId" TEXT,
    "changesJson" JSONB NOT NULL,
    "status" "public"."ChangeStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "PendingChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lawyerId" TEXT,
    "firmId" TEXT,
    "planType" "public"."PlanType" NOT NULL,
    "stripeSubscriptionId" TEXT,
    "stripeCustomerId" TEXT,
    "status" "public"."SubscriptionStatus" NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Boost" (
    "id" TEXT NOT NULL,
    "profileType" "public"."TargetType" NOT NULL,
    "lawyerId" TEXT,
    "firmId" TEXT,
    "boostType" "public"."BoostType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "amountPaid" INTEGER NOT NULL,
    "stripePaymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Boost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProfileView" (
    "id" TEXT NOT NULL,
    "profileType" "public"."TargetType" NOT NULL,
    "lawyerId" TEXT,
    "firmId" TEXT,
    "viewerId" TEXT,
    "source" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LawFirm_ownerId_key" ON "public"."LawFirm"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Lawyer_userId_key" ON "public"."Lawyer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LawyerSpecialisation_lawyerId_specialisationId_key" ON "public"."LawyerSpecialisation"("lawyerId", "specialisationId");

-- CreateIndex
CREATE UNIQUE INDEX "FirmPracticeArea_firmId_specialisationId_key" ON "public"."FirmPracticeArea"("firmId", "specialisationId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewResponse_reviewId_key" ON "public"."ReviewResponse"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "FirmInvitation_token_key" ON "public"."FirmInvitation"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "public"."Subscription"("stripeSubscriptionId");

-- AddForeignKey
ALTER TABLE "public"."LawFirm" ADD CONSTRAINT "LawFirm_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FirmLocation" ADD CONSTRAINT "FirmLocation_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "public"."LawFirm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lawyer" ADD CONSTRAINT "Lawyer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lawyer" ADD CONSTRAINT "Lawyer_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "public"."LawFirm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Specialisation" ADD CONSTRAINT "Specialisation_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Specialisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LawyerSpecialisation" ADD CONSTRAINT "LawyerSpecialisation_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "public"."Lawyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LawyerSpecialisation" ADD CONSTRAINT "LawyerSpecialisation_specialisationId_fkey" FOREIGN KEY ("specialisationId") REFERENCES "public"."Specialisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FirmPracticeArea" ADD CONSTRAINT "FirmPracticeArea_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "public"."LawFirm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FirmPracticeArea" ADD CONSTRAINT "FirmPracticeArea_specialisationId_fkey" FOREIGN KEY ("specialisationId") REFERENCES "public"."Specialisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourtAppearance" ADD CONSTRAINT "CourtAppearance_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "public"."Lawyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LawyerLanguage" ADD CONSTRAINT "LawyerLanguage_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "public"."Lawyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Certification" ADD CONSTRAINT "Certification_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "public"."Lawyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "public"."Lawyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "public"."LawFirm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReviewResponse" ADD CONSTRAINT "ReviewResponse_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FirmInvitation" ADD CONSTRAINT "FirmInvitation_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "public"."LawFirm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FirmInvitation" ADD CONSTRAINT "FirmInvitation_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "public"."Lawyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LawyerRequest" ADD CONSTRAINT "LawyerRequest_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "public"."Lawyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RelationshipHistory" ADD CONSTRAINT "RelationshipHistory_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "public"."Lawyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PendingChange" ADD CONSTRAINT "PendingChange_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "public"."Lawyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PendingChange" ADD CONSTRAINT "PendingChange_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "public"."LawFirm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "public"."Lawyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "public"."LawFirm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Boost" ADD CONSTRAINT "Boost_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "public"."Lawyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Boost" ADD CONSTRAINT "Boost_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "public"."LawFirm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProfileView" ADD CONSTRAINT "ProfileView_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "public"."Lawyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProfileView" ADD CONSTRAINT "ProfileView_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "public"."LawFirm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
