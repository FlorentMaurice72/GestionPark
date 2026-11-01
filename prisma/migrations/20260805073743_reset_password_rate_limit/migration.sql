-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "reset_token" TEXT,
ADD COLUMN     "reset_token_expires_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "tentatives_connexion" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "reussie" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tentatives_connexion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tentatives_connexion_email_created_at_idx" ON "tentatives_connexion"("email", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "admins_reset_token_key" ON "admins"("reset_token");

