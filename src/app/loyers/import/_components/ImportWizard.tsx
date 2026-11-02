"use client";

import { useEffect, useState } from "react";
import { extraireTransactions } from "@/lib/import/csv";
import { trouverLocationCorrespondante } from "@/lib/import/matching";
import { importerPaiements, enregistrerTransactionsNonIdentifiees } from "@/lib/import/actions";
import type { LocationOption, PresetOption } from "@/lib/import/data";
import type { PresetCreated } from "@/lib/import/preset-actions";
import { StepIndicator } from "./StepIndicator";
import { EtapeSelection } from "./EtapeSelection";
import { EtapeTraitement } from "./EtapeTraitement";
import { EtapeVerification } from "./EtapeVerification";
import { EtapeTermine, type ResultatImportAffichage } from "./EtapeTermine";
import type { Etape, ErreurFormatLigne, LigneImport } from "./types";

interface Props {
  presets: PresetOption[];
  locations: LocationOption[];
}

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function etatInitial() {
  const aujourdHui = new Date();
  return {
    etape: "selection" as Etape,
    mois: aujourdHui.getUTCMonth() + 1,
    annee: aujourdHui.getUTCFullYear(),
    presetId: null as number | null,
    fichier: null as File | null,
  };
}

export function ImportWizard({ presets: presetsProp, locations }: Props) {
  const [presets, setPresets] = useState<PresetOption[]>(presetsProp);
  const [etape, setEtape] = useState<Etape>(etatInitial().etape);
  const [mois, setMois] = useState(etatInitial().mois);
  const [annee, setAnnee] = useState(etatInitial().annee);
  const [presetId, setPresetId] = useState<number | null>(presetsProp.length === 1 ? presetsProp[0].id : null);
  const [fichier, setFichier] = useState<File | null>(null);
  const [erreurTraitement, setErreurTraitement] = useState<string | null>(null);

  const [lignes, setLignes] = useState<LigneImport[]>([]);
  const [erreursFormat, setErreursFormat] = useState<ErreurFormatLigne[]>([]);

  const [erreurImport, setErreurImport] = useState<string | null>(null);
  const [enCoursImport, setEnCoursImport] = useState(false);
  const [resultat, setResultat] = useState<ResultatImportAffichage | null>(null);

  useEffect(() => {
    if (etape !== "traitement") return;
    let annule = false;

    (async () => {
      try {
        const preset = presets.find((p) => p.id === presetId);
        if (!preset || !fichier) {
          throw new Error("Fichier ou préréglage manquant.");
        }

        const texte = await fichier.text();
        const { transactions, erreurs } = extraireTransactions(texte, preset);

        const lignesCalculees: LigneImport[] = transactions.map((transaction) => {
          const resultatMatching = trouverLocationCorrespondante(transaction.libelle, locations);
          if (resultatMatching.statut === "trouve") {
            return {
              ligne: transaction.ligne,
              date: transaction.date,
              libelle: transaction.libelle,
              montant: transaction.montant,
              locationId: resultatMatching.locationId,
            };
          }
          return {
            ligne: transaction.ligne,
            date: transaction.date,
            libelle: transaction.libelle,
            montant: transaction.montant,
            locationId: null,
            raisonNonAffecte: resultatMatching.statut,
          };
        });

        if (annule) return;
        setLignes(lignesCalculees);
        setErreursFormat(erreurs);
        setEtape("verification");
      } catch (erreur) {
        if (annule) return;
        setErreurTraitement(erreur instanceof Error ? erreur.message : "Erreur lors du traitement du fichier.");
        setEtape("selection");
      }
    })();

    return () => {
      annule = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etape]);

  function handleChangeAffectation(ligneIndex: number, locationId: number | null) {
    setLignes((prev) =>
      prev.map((ligne, i) =>
        i === ligneIndex ? { ...ligne, locationId, raisonNonAffecte: locationId ? undefined : ligne.raisonNonAffecte } : ligne,
      ),
    );
  }

  useEffect(() => {
    if (etape !== "import") return;
    let annule = false;

    (async () => {
      const entrees = lignes
        .filter((l) => l.locationId !== null)
        .map((l) => ({ locationId: l.locationId as number, montant: l.montant, datePaiement: toISODate(l.date) }));

      const reponse = await importerPaiements({ mois, annee, entrees });
      if (annule) return;

      if (!reponse.success) {
        setErreurImport(reponse.error ?? "Échec de l'import.");
        setEnCoursImport(false);
        setEtape("verification");
        return;
      }

      const locationsParId = new Map(locations.map((l) => [l.id, l]));
      const compteParBien = new Map<string, number>();
      for (const entree of entrees) {
        const location = locationsParId.get(entree.locationId);
        const label = location?.bienNom ?? "Bien inconnu";
        compteParBien.set(label, (compteParBien.get(label) ?? 0) + 1);
      }

      const nonIdentifiees = lignes
        .filter((l) => l.locationId === null)
        .map((l) => ({ libelle: l.libelle, montant: l.montant, datePaiement: toISODate(l.date) }));
      await enregistrerTransactionsNonIdentifiees(mois, annee, nonIdentifiees);

      setResultat({
        total: entrees.length,
        parBien: Array.from(compteParBien.entries()).map(([label, count]) => ({ label, count })),
        nonIdentifies: nonIdentifiees.length,
      });
      setEnCoursImport(false);
      setEtape("termine");
    })();

    return () => {
      annule = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etape]);

  function handleConfirmerImport() {
    setEnCoursImport(true);
    setErreurImport(null);
    setEtape("import");
  }

  function handlePresetCree(preset: PresetCreated) {
    const nouveau: PresetOption = {
      id: preset.id,
      name: preset.name,
      delimiter: preset.delimiter,
      columns: preset.columns,
      dateColumn: preset.dateColumn,
      descriptionColumn: preset.descriptionColumn,
      amountColumn: preset.amountColumn,
      hasHeaderRow: preset.hasHeaderRow,
    };
    setPresets((prev) => [...prev, nouveau]);
    setPresetId(preset.id);
  }

  function handleNouvelImport() {
    const initial = etatInitial();
    setEtape(initial.etape);
    setMois(initial.mois);
    setAnnee(initial.annee);
    setPresetId(presets.length === 1 ? presets[0].id : null);
    setFichier(initial.fichier);
    setErreurTraitement(null);
    setLignes([]);
    setErreursFormat([]);
    setErreurImport(null);
    setResultat(null);
  }

  return (
    <div>
      <StepIndicator etapeActuelle={etape} />

      {etape === "selection" && (
        <EtapeSelection
          presets={presets}
          mois={mois}
          annee={annee}
          presetId={presetId}
          fichier={fichier}
          erreur={erreurTraitement}
          onChangeMois={setMois}
          onChangeAnnee={setAnnee}
          onChangePreset={setPresetId}
          onChangeFichier={setFichier}
          onValider={() => {
            setErreurTraitement(null);
            setEtape("traitement");
          }}
          onCreerPreset={handlePresetCree}
        />
      )}

      {etape === "traitement" && <EtapeTraitement />}

      {etape === "verification" && (
        <EtapeVerification
          lignes={lignes}
          erreursFormat={erreursFormat}
          locations={locations}
          erreurImport={erreurImport}
          enCours={enCoursImport}
          onChangeAffectation={handleChangeAffectation}
          onRetour={() => setEtape("selection")}
          onConfirmer={handleConfirmerImport}
        />
      )}

      {etape === "import" && <EtapeTraitement message="Import des paiements en base en cours…" />}

      {etape === "termine" && resultat && (
        <EtapeTermine resultat={resultat} onNouvelImport={handleNouvelImport} />
      )}
    </div>
  );
}
