import type { DocumentsPageData } from "@/lib/documents/data";
import { SousOngletsDocuments } from "./SousOngletsDocuments";
import { FiltresDocuments } from "./FiltresDocuments";
import { DocumentsTable } from "./DocumentsTable";
import { AjouterDocumentModal } from "./AjouterDocumentModal";
import { GenererRelanceARModal } from "./GenererRelanceARModal";
import { GenererCongeModal } from "./GenererCongeModal";

interface Props {
  data: DocumentsPageData;
  categorie: string | null;
  bienId: number | null;
  locataireId: number | null;
  annee: number | null;
  mois: number;
  anneeCourante: number;
}

export function DocumentsFactures({ data, categorie, bienId, locataireId, annee, mois, anneeCourante }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <SousOngletsDocuments categorie={categorie} />

      <FiltresDocuments biens={data.biens} locataires={data.locataires} bienId={bienId} locataireId={locataireId} annee={annee} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <GenererRelanceARModal locatairesActifs={data.locatairesActifs} />
          <GenererCongeModal locatairesActifs={data.locatairesActifs} />
          <a
            href={`/finances/export?mois=${mois}&annee=${anneeCourante}${bienId ? `&bien=${bienId}` : ""}`}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Exporter comptable mensuel
          </a>
        </div>
        <AjouterDocumentModal biens={data.biens} locataires={data.locataires} />
      </div>

      <DocumentsTable documents={data.documents} />
    </div>
  );
}
