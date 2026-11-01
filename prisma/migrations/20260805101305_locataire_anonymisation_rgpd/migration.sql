-- AlterTable
ALTER TABLE "locataires" ADD COLUMN     "anonymise" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "anonymise_le" TIMESTAMP(3);

