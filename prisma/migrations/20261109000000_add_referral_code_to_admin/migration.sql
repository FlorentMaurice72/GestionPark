-- Migration: add referral_code and referred_by_id to admins

ALTER TABLE "admins" ADD COLUMN "referral_code" TEXT;
ALTER TABLE "admins" ADD COLUMN "referred_by_id" INTEGER;

CREATE UNIQUE INDEX "admins_referral_code_key" ON "admins"("referral_code");
