-- CreateTable
CREATE TABLE "transactions_non_identifiees" (
    "id" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,
    "montant" DECIMAL(10,2) NOT NULL,
    "date_paiement" DATE NOT NULL,
    "mois" INTEGER NOT NULL,
    "annee" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_non_identifiees_pkey" PRIMARY KEY ("id")
);
