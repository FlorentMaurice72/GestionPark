-- CreateTable
CREATE TABLE "relances" (
    "id" SERIAL NOT NULL,
    "location_id" INTEGER NOT NULL,
    "date_envoi" TIMESTAMP(3) NOT NULL,
    "canal" TEXT NOT NULL,
    "contenu_texte" TEXT NOT NULL,

    CONSTRAINT "relances_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "relances" ADD CONSTRAINT "relances_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
