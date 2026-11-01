-- AlterTable: ajout de utilisateur_id sur les 4 tables racines (nullable d'abord,
-- backfill avec le premier admin, puis NOT NULL + FK)

ALTER TABLE "biens" ADD COLUMN "utilisateur_id" INTEGER;
ALTER TABLE "locataires" ADD COLUMN "utilisateur_id" INTEGER;
ALTER TABLE "import_presets" ADD COLUMN "utilisateur_id" INTEGER;
ALTER TABLE "transactions_non_identifiees" ADD COLUMN "utilisateur_id" INTEGER;

-- Backfill : attribue toutes les données existantes au premier admin créé
UPDATE "biens" SET utilisateur_id = (SELECT id FROM admins ORDER BY id LIMIT 1);
UPDATE "locataires" SET utilisateur_id = (SELECT id FROM admins ORDER BY id LIMIT 1);
UPDATE "import_presets" SET utilisateur_id = (SELECT id FROM admins ORDER BY id LIMIT 1);
UPDATE "transactions_non_identifiees" SET utilisateur_id = (SELECT id FROM admins ORDER BY id LIMIT 1);

-- NOT NULL
ALTER TABLE "biens" ALTER COLUMN "utilisateur_id" SET NOT NULL;
ALTER TABLE "locataires" ALTER COLUMN "utilisateur_id" SET NOT NULL;
ALTER TABLE "import_presets" ALTER COLUMN "utilisateur_id" SET NOT NULL;
ALTER TABLE "transactions_non_identifiees" ALTER COLUMN "utilisateur_id" SET NOT NULL;

-- Foreign keys
ALTER TABLE "biens" ADD CONSTRAINT "biens_utilisateur_id_fkey"
  FOREIGN KEY ("utilisateur_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "locataires" ADD CONSTRAINT "locataires_utilisateur_id_fkey"
  FOREIGN KEY ("utilisateur_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "import_presets" ADD CONSTRAINT "import_presets_utilisateur_id_fkey"
  FOREIGN KEY ("utilisateur_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "transactions_non_identifiees" ADD CONSTRAINT "transactions_non_identifiees_utilisateur_id_fkey"
  FOREIGN KEY ("utilisateur_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
