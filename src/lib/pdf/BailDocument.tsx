import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export interface BailProps {
  // Bailleur
  bailleurNom: string;
  bailleurAdresse: string | null;
  bailleurEmail: string;
  // Locataire
  locataireNom: string;
  locatairePrenom: string;
  locataireSociete: string | null;
  locataireAdresse: string;
  locataireVille: string;
  locataireCodePostal: string;
  // Bien / Box
  bienNom: string;
  bienAdresse: string;
  boxNumero: string;
  boxSuperficie: number;
  // Location
  typeBail: string;
  dateEntree: Date;
  loyerActuel: number;
  termeLoyerType: string;
  moyenPaiement: string;
  depotGarantie: number;
  renouvellementAuto: boolean;
  indiceRevision: string;
  dateRevisionIRL: Date | null;
}

const TERME_LABELS: Record<string, string> = {
  a_echoir: "à terme à échoir (en début de mois)",
  terme_echu: "à terme échu (en fin de mois)",
};
const MOYEN_LABELS: Record<string, string> = {
  virement: "virement bancaire",
  cheque: "chèque",
  especes: "espèces",
  prelevement: "prélèvement automatique",
};
const INDICE_LABELS: Record<string, string> = {
  IRL: "Indice de Référence des Loyers (IRL) publié par l'INSEE",
  ICC: "Indice du Coût de la Construction (ICC) publié par l'INSEE",
  fixe: "loyer fixe (sans révision indexée)",
};
const TYPE_BAIL_LABELS: Record<string, string> = {
  bail_box: "Box de stockage",
  bail_garage: "Garage",
  bail_commercial: "Local commercial",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
const fmtDate = (d: Date) =>
  new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

const s = StyleSheet.create({
  page: { padding: 50, fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a", lineHeight: 1.5 },
  titre: { fontSize: 16, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 4 },
  sousTitre: { fontSize: 10, textAlign: "center", color: "#555", marginBottom: 24 },
  separator: { borderBottomWidth: 1, borderBottomColor: "#d0d0d0", marginVertical: 14 },
  h2: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#0047AB", marginBottom: 6, marginTop: 2 },
  p: { fontSize: 10, marginBottom: 6 },
  bold: { fontFamily: "Helvetica-Bold" },
  row: { flexDirection: "row", marginBottom: 3 },
  label: { width: 160, color: "#555" },
  val: { flex: 1 },
  parties: { flexDirection: "row", gap: 20, marginBottom: 10 },
  partiBox: { flex: 1, padding: 10, backgroundColor: "#f8f8f8", borderRadius: 4 },
  partiLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#888", marginBottom: 4 },
  footer: {
    position: "absolute", bottom: 28, left: 50, right: 50,
    fontSize: 8, color: "#aaa", textAlign: "center", borderTopWidth: 1, borderTopColor: "#e8e8e8", paddingTop: 6,
  },
  sig: { flexDirection: "row", marginTop: 30, gap: 30 },
  sigBox: {
    flex: 1, borderTopWidth: 1, borderTopColor: "#555", paddingTop: 8,
    fontSize: 9, color: "#555",
  },
});

export function BailDocument(props: BailProps) {
  const {
    bailleurNom, bailleurAdresse, bailleurEmail,
    locataireNom, locatairePrenom, locataireSociete,
    locataireAdresse, locataireVille, locataireCodePostal,
    bienNom, bienAdresse, boxNumero, boxSuperficie,
    typeBail, dateEntree, loyerActuel, termeLoyerType, moyenPaiement,
    depotGarantie, renouvellementAuto, indiceRevision, dateRevisionIRL,
  } = props;

  const typeBailLabel = TYPE_BAIL_LABELS[typeBail] ?? typeBail;
  const indiceLabel = INDICE_LABELS[indiceRevision] ?? indiceRevision;
  const termeLabel = TERME_LABELS[termeLoyerType] ?? termeLoyerType;
  const moyenLabel = MOYEN_LABELS[moyenPaiement] ?? moyenPaiement;
  const locataireIdentite = locataireSociete
    ? `${locatairePrenom} ${locataireNom} (${locataireSociete})`
    : `${locatairePrenom} ${locataireNom}`;

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* En-tête */}
        <Text style={s.titre}>CONTRAT DE LOCATION — {typeBailLabel.toUpperCase()}</Text>
        <Text style={s.sousTitre}>
          {bienNom} · Box {boxNumero} · Prise d&apos;effet le {fmtDate(dateEntree)}
        </Text>

        <View style={s.separator} />

        {/* Parties */}
        <View style={s.parties}>
          <View style={s.partiBox}>
            <Text style={s.partiLabel}>LE BAILLEUR</Text>
            <Text style={s.bold}>{bailleurNom || "—"}</Text>
            {bailleurAdresse ? <Text>{bailleurAdresse}</Text> : null}
            <Text>{bailleurEmail}</Text>
          </View>
          <View style={s.partiBox}>
            <Text style={s.partiLabel}>LE LOCATAIRE</Text>
            <Text style={s.bold}>{locataireIdentite}</Text>
            <Text>{locataireAdresse}</Text>
            <Text>{locataireCodePostal} {locataireVille}</Text>
          </View>
        </View>

        <View style={s.separator} />

        {/* Art 1 — Objet */}
        <Text style={s.h2}>Article 1 — Objet du bail</Text>
        <Text style={s.p}>
          Le bailleur loue au locataire un {typeBailLabel.toLowerCase()} situé au sein de la propriété
          <Text style={s.bold}> {bienNom}</Text>, adresse : <Text style={s.bold}>{bienAdresse}</Text>,
          portant le numéro <Text style={s.bold}>{boxNumero}</Text>, d&apos;une superficie approximative
          de <Text style={s.bold}>{boxSuperficie.toFixed(1)} m²</Text>.
        </Text>
        <Text style={s.p}>
          Le local est loué à usage exclusif de stockage. Toute autre utilisation est interdite.
          Le locataire s&apos;interdit notamment d&apos;y stocker des matières dangereuses, inflammables,
          explosives ou des déchets, d&apos;y élire domicile ou d&apos;y exercer une activité professionnelle.
        </Text>

        {/* Art 2 — Durée */}
        <Text style={s.h2}>Article 2 — Durée</Text>
        <Text style={s.p}>
          Le présent bail prend effet le <Text style={s.bold}>{fmtDate(dateEntree)}</Text> pour une durée
          d&apos;un (1) an, renouvelable par tacite reconduction, sauf congé donné par l&apos;une ou l&apos;autre
          des parties avec un préavis d&apos;un (1) mois.
          {renouvellementAuto
            ? " Le renouvellement est activé : le bail se renouvelle automatiquement à chaque échéance."
            : " Le renouvellement automatique est désactivé."}
        </Text>

        {/* Art 3 — Loyer */}
        <Text style={s.h2}>Article 3 — Loyer</Text>
        <View style={s.row}>
          <Text style={s.label}>Montant mensuel :</Text>
          <Text style={[s.val, s.bold]}>{fmt(loyerActuel)} TTC</Text>
        </View>
        <View style={s.row}>
          <Text style={s.label}>Terme :</Text>
          <Text style={s.val}>{termeLabel}</Text>
        </View>
        <View style={s.row}>
          <Text style={s.label}>Mode de règlement :</Text>
          <Text style={s.val}>{moyenLabel}</Text>
        </View>

        {/* Art 4 — Révision */}
        <Text style={s.h2}>Article 4 — Révision du loyer</Text>
        {indiceRevision === "fixe" ? (
          <Text style={s.p}>
            Le loyer est fixe et ne fait l&apos;objet d&apos;aucune révision indexée.
          </Text>
        ) : (
          <Text style={s.p}>
            Le loyer sera révisé annuellement conformément à l&apos;{indiceLabel}.
            {dateRevisionIRL
              ? ` La prochaine date de révision est fixée au ${fmtDate(dateRevisionIRL)}.`
              : ""}
            {" "}Le nouveau loyer sera calculé selon la formule :{" "}
            Loyer actuel × (Dernier indice publié / Indice de référence à la signature).
          </Text>
        )}

        {/* Art 5 — Dépôt de garantie */}
        <Text style={s.h2}>Article 5 — Dépôt de garantie</Text>
        <Text style={s.p}>
          À la signature du présent contrat, le locataire verse au bailleur un dépôt de garantie
          de <Text style={s.bold}>{fmt(depotGarantie)}</Text>{depotGarantie > 0 ? `, soit ${(depotGarantie / loyerActuel).toFixed(1)} mois de loyer` : ""}.
          Cette somme sera restituée au locataire dans un délai maximum d&apos;un (1) mois suivant la remise
          des clés, déduction faite des sommes dues au titre du bail.
        </Text>

        {/* Art 6 — Obligations */}
        <Text style={s.h2}>Article 6 — Obligations du locataire</Text>
        <Text style={s.p}>
          Le locataire s&apos;engage à : (1) régler le loyer aux dates convenues ; (2) utiliser le local
          conformément à sa destination et de façon raisonnable ; (3) restituer le local en bon état
          à la fin du bail ; (4) souscrire une assurance couvrant les risques locatifs et en justifier
          à première demande ; (5) ne pas sous-louer sans accord écrit du bailleur.
        </Text>

        {/* Art 7 — Résiliation */}
        <Text style={s.h2}>Article 7 — Résiliation</Text>
        <Text style={s.p}>
          En cas de non-paiement du loyer à son échéance, le bailleur pourra, après mise en demeure
          restée sans effet pendant huit (8) jours, résilier le présent bail de plein droit.
          Les frais de recouvrement seront à la charge du locataire.
        </Text>

        <View style={s.separator} />

        {/* Signatures */}
        <Text style={{ fontSize: 9, color: "#555", marginBottom: 10 }}>
          Fait en deux exemplaires originaux — généré le {new Date().toLocaleDateString("fr-FR")}
        </Text>
        <View style={s.sig}>
          <View style={s.sigBox}>
            <Text>Le Bailleur</Text>
            <Text style={s.bold}>{bailleurNom || "—"}</Text>
            <Text style={{ marginTop: 20, color: "#aaa" }}>Signature :</Text>
          </View>
          <View style={s.sigBox}>
            <Text>Le Locataire</Text>
            <Text style={s.bold}>{locataireIdentite}</Text>
            <Text style={{ marginTop: 20, color: "#aaa" }}>Signature :</Text>
          </View>
        </View>

        <Text style={s.footer}>
          Document généré par GestionPark · {bienNom} · Box {boxNumero} ·
          Ce document ne constitue pas un acte notarié. Faire relire par un professionnel du droit si nécessaire.
        </Text>
      </Page>
    </Document>
  );
}
