-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "biens" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "type_bien" TEXT NOT NULL,
    "adresse_complete" TEXT NOT NULL,
    "nombre_boxes" INTEGER NOT NULL,
    "taxe_fonciere" DECIMAL(12,2) NOT NULL,
    "assurance" DECIMAL(12,2) NOT NULL,
    "montant_emprunt" DECIMAL(12,2) NOT NULL,
    "mensualite_emprunt" DECIMAL(12,2) NOT NULL,
    "taux_emprunt" DECIMAL(6,3) NOT NULL,
    "date_debut_emprunt" DATE NOT NULL,
    "duree_emprunt" INTEGER NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'actif',
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "biens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boxes" (
    "id" SERIAL NOT NULL,
    "bien_id" INTEGER NOT NULL,
    "numero" TEXT NOT NULL,
    "superficie" DECIMAL(10,2) NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'vacant',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "boxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locataires" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "societe" TEXT,
    "association" TEXT,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "code_postal" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'actif',
    "date_archivage" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locataires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "box_id" INTEGER NOT NULL,
    "locataire_id" INTEGER NOT NULL,
    "date_entree" DATE NOT NULL,
    "loyer_actuel" DECIMAL(10,2) NOT NULL,
    "depot_garantie" DECIMAL(10,2) NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'actif',
    "date_fin" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "matching_inputs" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paiements" (
    "id" SERIAL NOT NULL,
    "location_id" INTEGER NOT NULL,
    "mois" INTEGER NOT NULL,
    "annee" INTEGER NOT NULL,
    "montant" DECIMAL(10,2) NOT NULL,
    "date_paiement" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mode" TEXT NOT NULL,

    CONSTRAINT "paiements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "file_id" TEXT NOT NULL,
    "nom_fichier" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "bien_id" INTEGER NOT NULL,
    "locataire_id" INTEGER NOT NULL,
    "charge_montant" DECIMAL(10,2),
    "charge_type" TEXT,
    "date_document" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_presets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date_column" TEXT NOT NULL,
    "description_column" TEXT NOT NULL,
    "amount_column" TEXT NOT NULL,
    "delimiter" TEXT NOT NULL,
    "columns" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "has_header_row" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "import_presets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "boxes_numero_key" ON "boxes"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- AddForeignKey
ALTER TABLE "boxes" ADD CONSTRAINT "boxes_bien_id_fkey" FOREIGN KEY ("bien_id") REFERENCES "biens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_box_id_fkey" FOREIGN KEY ("box_id") REFERENCES "boxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_locataire_id_fkey" FOREIGN KEY ("locataire_id") REFERENCES "locataires"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiements" ADD CONSTRAINT "paiements_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_bien_id_fkey" FOREIGN KEY ("bien_id") REFERENCES "biens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_locataire_id_fkey" FOREIGN KEY ("locataire_id") REFERENCES "locataires"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Règle métier : un locataire ne peut avoir qu'une seule Location active à la
-- fois. Non exprimable en Prisma schema (pas d'index partiel natif) : ajouté
-- ici à la main. Reste un filet de sécurité — le contrôle applicatif (avant
-- insertion) doit rester la première ligne de défense pour renvoyer une
-- erreur lisible plutôt qu'une violation de contrainte brute.
CREATE UNIQUE INDEX "locations_one_active_per_locataire"
    ON "locations" ("locataire_id")
    WHERE "statut" = 'actif';
