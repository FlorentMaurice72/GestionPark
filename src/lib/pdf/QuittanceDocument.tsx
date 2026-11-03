import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface QuittanceProps {
  locataireNom: string;
  locatairePrenom: string;
  locataireAdresse: string;
  locataireVille: string;
  locataireCodePostal: string;
  bienNom: string;
  boxNumero: string;
  mois: number;
  annee: number;
  loyerActuel: number;
  depotGarantie: number;
  montantRecu: number;
  dateEncaissement: string;
  bailleurEmail: string;
  bailleurNom?: string | null;
  bailleurAdresse?: string | null;
}

const NOMS_MOIS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

const styles = StyleSheet.create({
  page: { padding: 50, fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a" },
  header: { marginBottom: 30 },
  titre: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  sousTitre: { fontSize: 10, color: "#555" },
  section: { marginBottom: 20 },
  sectionTitre: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#888", marginBottom: 6 },
  ligne: { flexDirection: "row", marginBottom: 3 },
  label: { width: 140, color: "#555" },
  valeur: { flex: 1, fontFamily: "Helvetica-Bold" },
  separator: { borderBottomWidth: 1, borderBottomColor: "#e0e0e0", marginVertical: 16 },
  montant: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#111" },
  footer: { position: "absolute", bottom: 30, left: 50, right: 50, fontSize: 8, color: "#888", textAlign: "center" },
  badge: { backgroundColor: "#f0f9f0", padding: 6, borderRadius: 4, marginTop: 8 },
  badgeText: { color: "#166534", fontFamily: "Helvetica-Bold", fontSize: 9 },
  reste: { color: "#b91c1c" },
});

export function QuittanceDocument({
  locataireNom,
  locatairePrenom,
  locataireAdresse,
  locataireVille,
  locataireCodePostal,
  bienNom,
  boxNumero,
  mois,
  annee,
  loyerActuel,
  depotGarantie,
  montantRecu,
  dateEncaissement,
  bailleurEmail,
  bailleurNom,
  bailleurAdresse,
}: QuittanceProps) {
  const nomMois = NOMS_MOIS[mois - 1];
  const montantDu = Math.max(loyerActuel - montantRecu, 0);
  const quittancePartielle = montantRecu < loyerActuel && montantRecu > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.titre}>
            {quittancePartielle ? "Reçu partiel de loyer" : "Quittance de loyer"}
          </Text>
          <Text style={styles.sousTitre}>Période : {nomMois} {annee}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitre}>BAILLEUR</Text>
          {bailleurNom && (
            <View style={styles.ligne}>
              <Text style={styles.label}>Nom</Text>
              <Text style={styles.valeur}>{bailleurNom}</Text>
            </View>
          )}
          {bailleurAdresse && (
            <View style={styles.ligne}>
              <Text style={styles.label}>Adresse</Text>
              <Text style={styles.valeur}>{bailleurAdresse}</Text>
            </View>
          )}
          <View style={styles.ligne}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.valeur}>{bailleurEmail}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.sectionTitre}>LOCATAIRE</Text>
          <View style={styles.ligne}>
            <Text style={styles.label}>Nom</Text>
            <Text style={styles.valeur}>{locatairePrenom} {locataireNom}</Text>
          </View>
          <View style={styles.ligne}>
            <Text style={styles.label}>Adresse</Text>
            <Text style={styles.valeur}>{locataireAdresse}</Text>
          </View>
          <View style={styles.ligne}>
            <Text style={styles.label}>Ville</Text>
            <Text style={styles.valeur}>{locataireCodePostal} {locataireVille}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.sectionTitre}>BIEN LOUÉ</Text>
          <View style={styles.ligne}>
            <Text style={styles.label}>Propriété</Text>
            <Text style={styles.valeur}>{bienNom}</Text>
          </View>
          <View style={styles.ligne}>
            <Text style={styles.label}>Box</Text>
            <Text style={styles.valeur}>{boxNumero}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.sectionTitre}>DÉTAIL DU RÈGLEMENT</Text>
          <View style={styles.ligne}>
            <Text style={styles.label}>Loyer</Text>
            <Text style={styles.valeur}>{loyerActuel.toFixed(2)} €</Text>
          </View>
          <View style={styles.ligne}>
            <Text style={styles.label}>Dépôt de garantie</Text>
            <Text style={styles.valeur}>{depotGarantie.toFixed(2)} €</Text>
          </View>
          <View style={styles.ligne}>
            <Text style={styles.label}>Montant encaissé</Text>
            <Text style={[styles.valeur, styles.montant]}>{montantRecu.toFixed(2)} €</Text>
          </View>
          {montantDu > 0 && (
            <View style={styles.ligne}>
              <Text style={styles.label}>Reste dû</Text>
              <Text style={[styles.valeur, styles.reste]}>{montantDu.toFixed(2)} €</Text>
            </View>
          )}
          <View style={styles.ligne}>
            <Text style={styles.label}>Date d&apos;encaissement</Text>
            <Text style={styles.valeur}>{dateEncaissement}</Text>
          </View>
        </View>

        {montantRecu >= loyerActuel && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Loyer intégralement acquitté pour {nomMois} {annee}
            </Text>
          </View>
        )}

        <Text style={styles.footer}>
          Document généré automatiquement par GestionPark le {new Date().toLocaleDateString("fr-FR")} —
          Ce document tient lieu de quittance de loyer conformément aux articles 21 de la loi du 6 juillet 1989 et L.145-40 du Code de commerce.
        </Text>
      </Page>
    </Document>
  );
}
