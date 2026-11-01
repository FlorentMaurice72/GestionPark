-- AlterTable
ALTER TABLE "biens" ADD COLUMN     "valeur_estimee" DECIMAL(12,2);

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "contenu_texte" TEXT,
ALTER COLUMN "locataire_id" DROP NOT NULL;
