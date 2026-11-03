import { Resend } from "resend";

// RESEND_API_KEY : clé API du compte Resend (https://resend.com), à créer en
// prod. EMAIL_FROM doit être une adresse d'un domaine vérifié dans Resend ;
// en attendant, "onboarding@resend.dev" fonctionne mais seulement pour
// envoyer vers l'email du compte Resend lui-même (limite du mode test).
//
// Client instancié à l'appel (pas au chargement du module) : `new Resend("")`
// lève immédiatement, ce qui ferait planter toute route qui importe ce
// fichier tant que RESEND_API_KEY n'est pas configurée.
const EMAIL_FROM = process.env.EMAIL_FROM ?? "GestionPark <onboarding@resend.dev>";

export class EmailNonConfigure extends Error {}

export async function envoyerEmailRelance(destinataire: string, contenu: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    throw new EmailNonConfigure("RESEND_API_KEY absente.");
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const firstLine = contenu.split("\n")[0]?.trim() ?? "Relance de loyer";
  await resend.emails.send({
    from: EMAIL_FROM,
    to: destinataire,
    subject: firstLine,
    text: contenu,
    html: contenu.replace(/\n/g, "<br>"),
  });
}

export async function envoyerEmailAvisLoyer(
  destinataire: string,
  opts: {
    locataireNom: string;
    bienNom: string;
    boxNumero: string;
    mois: number;
    annee: number;
    montant: number;
    bailleurNom?: string | null;
    bailleurEmail: string;
  }
): Promise<void> {
  if (!process.env.RESEND_API_KEY) throw new EmailNonConfigure("RESEND_API_KEY absente.");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const moisLabel = new Date(opts.annee, opts.mois - 1).toLocaleString("fr-FR", { month: "long" });
  const subject = `Avis de loyer — ${moisLabel} ${opts.annee}`;
  const html = `
    <p>Bonjour ${opts.locataireNom},</p>
    <p>Votre loyer pour le mois de <strong>${moisLabel} ${opts.annee}</strong> s'élève à <strong>${opts.montant} €</strong>.</p>
    <p>Box : ${opts.boxNumero} — ${opts.bienNom}</p>
    <p>Merci de procéder au règlement à la date habituelle.</p>
    <br>
    <p>${opts.bailleurNom ?? opts.bailleurEmail}</p>
  `;
  await resend.emails.send({ from: EMAIL_FROM, to: destinataire, subject, html, text: html.replace(/<[^>]+>/g, "") });
}

export async function envoyerEmailResetMotDePasse(destinataire: string, lien: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    throw new EmailNonConfigure("RESEND_API_KEY absente.");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: EMAIL_FROM,
    to: destinataire,
    subject: "Réinitialisation de votre mot de passe GestionPark",
    html: `
      <p>Une demande de réinitialisation de mot de passe a été effectuée pour votre compte GestionPark.</p>
      <p><a href="${lien}">Cliquez ici pour choisir un nouveau mot de passe</a></p>
      <p>Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
    `,
  });
}
