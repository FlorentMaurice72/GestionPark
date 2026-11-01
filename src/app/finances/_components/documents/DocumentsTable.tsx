import type { DocumentListItem } from "@/lib/documents/data";
import { libelleTypeDocument } from "@/lib/documents/types";
import { formaterMontant } from "@/lib/format";
import { LigneDocumentActions } from "./LigneDocumentActions";

function formaterDate(date: Date): string {
  return date.toLocaleDateString("fr-FR");
}

export function DocumentsTable({ documents }: { documents: DocumentListItem[] }) {
  if (documents.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
        Aucun document pour cette sélection.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-xs font-medium text-neutral-500 dark:border-neutral-800">
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Nom</th>
            <th className="px-4 py-3">Bien</th>
            <th className="px-4 py-3">Locataire</th>
            <th className="px-4 py-3">Montant</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/60">
              <td className="px-4 py-3">{formaterDate(doc.dateDocument)}</td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
                  {libelleTypeDocument(doc.type)}
                </span>
              </td>
              <td className="px-4 py-3">
                {doc.nomFichier}
                {doc.description && <p className="text-xs text-neutral-500">{doc.description}</p>}
              </td>
              <td className="px-4 py-3">{doc.bienNom}</td>
              <td className="px-4 py-3">{doc.locataireNom ?? "—"}</td>
              <td className="px-4 py-3">{doc.chargeMontant !== null ? formaterMontant(doc.chargeMontant) : "—"}</td>
              <td className="px-4 py-3">
                <LigneDocumentActions id={doc.id} nomFichier={doc.nomFichier} contenuTexte={doc.contenuTexte} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
