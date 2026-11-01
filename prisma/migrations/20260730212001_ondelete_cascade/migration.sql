-- DropForeignKey
ALTER TABLE "boxes" DROP CONSTRAINT "boxes_bien_id_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_bien_id_fkey";

-- DropForeignKey
ALTER TABLE "locations" DROP CONSTRAINT "locations_box_id_fkey";

-- DropForeignKey
ALTER TABLE "paiements" DROP CONSTRAINT "paiements_location_id_fkey";

-- DropForeignKey
ALTER TABLE "relances" DROP CONSTRAINT "relances_location_id_fkey";

-- AddForeignKey
ALTER TABLE "boxes" ADD CONSTRAINT "boxes_bien_id_fkey" FOREIGN KEY ("bien_id") REFERENCES "biens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_box_id_fkey" FOREIGN KEY ("box_id") REFERENCES "boxes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiements" ADD CONSTRAINT "paiements_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relances" ADD CONSTRAINT "relances_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_bien_id_fkey" FOREIGN KEY ("bien_id") REFERENCES "biens"("id") ON DELETE CASCADE ON UPDATE CASCADE;
