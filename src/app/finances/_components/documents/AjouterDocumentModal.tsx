"use client";

import { useActionState, useState, useRef } from "react";
import { creerDocument, type ActionState } from "@/lib/documents/actions";
import { TYPES_DOCUMENT } from "@/lib/documents/types";
import type { OptionSimple } from "@/lib/documents/data";

const ETAT_INITIAL: ActionState = { success: false };

const champClasses =
  "w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AjouterDocumentModal({ biens, locataires }: { biens: OptionSimple[]; locataires: OptionSimple[] }) {
  const [ouvert, setOuvert] = useState(false);
  const [fileId, setFileId] = useState<string | null>(null);
  const [uploadEnCours, setUploadEnCours] = useState(false);
  const [uploadErreur, setUploadErreur] = useState<string | null>(null);
  const [nomFichierLocal, setNomFichierLocal] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [etat, formAction, enCours] = useActionState(async (_prev: ActionState, formData: FormData) => {
    if (fileId) formData.set("fileId", fileId);
    const resultat = await creerDocument(_prev, formData);
    if (resultat.success) {
      setOuvert(false);
      setFileId(null);
      setNomFichierLocal("");
    }
    return resultat;
  }, ETAT_INITIAL);

  async function handleFichier(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    if (!fichier) return;
    setUploadErreur(null);
    setFileId(null);
    setUploadEnCours(true);
    try {
      const fd = new FormData();
      fd.append("file", fichier);
      const res = await fetch("/api/documents/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur upload");
      setFileId(json.fileId as string);
      setNomFichierLocal(fichier.name);
    } catch (err) {
      setUploadErreur(err instanceof Error ? err.message : "Erreur upload");
      if (fileRef.current) fileRef.current.value = "";
    } finally {
      setUploadEnCours(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
      >
        Ajouter un document
      </button>

      {ouvert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOuvert(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900"
          >
            <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Nouveau document
            </h2>

            <form action={formAction} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Type</label>
                <select name="type" required className={champClasses}>
                  {TYPES_DOCUMENT.map((t) => (
                    <option key={t.valeur} value={t.valeur}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Nom du document</label>
                <input name="nomFichier" required className={champClasses} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Bien</label>
                <select name="bienId" required className={champClasses}>
                  {biens.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Locataire (optionnel)</label>
                <select name="locataireId" defaultValue="" className={champClasses}>
                  <option value="">—</option>
                  {locataires.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Date</label>
                <input name="dateDocument" type="date" defaultValue={todayISO()} required className={champClasses} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Description (optionnel)</label>
                <input name="description" className={champClasses} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">
                  Fichier (optionnel — PDF, JPEG, PNG, DOCX, max 10 Mo)
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.docx,.doc"
                  onChange={handleFichier}
                  className="w-full text-sm text-neutral-600 file:mr-3 file:rounded-md file:border file:border-neutral-300 file:bg-white file:px-2 file:py-1 file:text-xs file:font-medium hover:file:bg-neutral-50 dark:text-neutral-400 dark:file:border-neutral-700 dark:file:bg-neutral-800 dark:hover:file:bg-neutral-700"
                />
                {uploadEnCours && (
                  <p className="mt-1 text-xs text-neutral-500">Téléversement en cours…</p>
                )}
                {uploadErreur && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{uploadErreur}</p>
                )}
                {fileId && !uploadEnCours && (
                  <p className="mt-1 text-xs text-green-700 dark:text-green-400">
                    ✓ {nomFichierLocal} téléversé
                  </p>
                )}
              </div>

              {etat.error && <p className="text-sm text-red-600 dark:text-red-400">{etat.error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setOuvert(false); setFileId(null); setNomFichierLocal(""); }}
                  className="rounded-md px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={enCours || uploadEnCours}
                  className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
                >
                  {enCours ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
