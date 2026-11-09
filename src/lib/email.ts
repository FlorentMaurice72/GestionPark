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

function isDemoAddress(email: string): boolean {
  return email === "demo@gestionpark.fr" || email.endsWith("@example.com");
}

export async function envoyerEmailRelance(destinataire: string, contenu: string): Promise<void> {
  if (isDemoAddress(destinataire)) return;
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
  if (isDemoAddress(destinataire)) return;
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

export async function envoyerEmailBienvenue(destinataire: string): Promise<void> {
  if (isDemoAddress(destinataire)) return;
  if (!process.env.RESEND_API_KEY) return; /* non-bloquant si pas configuré */
  const resend = new Resend(process.env.RESEND_API_KEY);
  const siteUrl = process.env.NEXT_PUBLIC_URL ?? "https://gestionpark.fr";
  await resend.emails.send({
    from: EMAIL_FROM,
    to: destinataire,
    subject: "Bienvenue sur GestionPark 🎉 — 3 étapes pour démarrer",
    html: `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F8FF;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F8FF;padding:32px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">

        <!-- Header -->
        <tr><td style="background:#0047AB;padding:28px 32px">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:1px">GESTIONPARK</p>
          <p style="margin:6px 0 0;color:rgba(255,255,255,.75);font-size:13px">Logiciel de gestion de boxs de stockage</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px">
          <h1 style="margin:0 0 8px;font-size:22px;color:#0F2C59">Bienvenue ! 🎉</h1>
          <p style="margin:0 0 20px;color:#64748B;font-size:14px;line-height:1.6">
            Votre compte GestionPark est créé. Vous avez <strong>14 jours d'essai gratuit</strong> pour explorer toutes les fonctionnalités — aucun prélèvement pendant cette période.
          </p>

          <p style="margin:0 0 12px;font-weight:600;color:#0F2C59;font-size:14px">3 étapes pour démarrer :</p>

          <!-- Étapes -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
            ${[
              ["1", "#0047AB", "Ajoutez votre premier bien", "Renseignez l'adresse et les boxs qui le composent."],
              ["2", "#0097A7", "Créez votre premier locataire", "Saisissez ses coordonnées, le box et le loyer mensuel."],
              ["3", "#20B2AA", "Importez votre relevé bancaire", "Glissez votre CSV — GestionPark identifie les paiements automatiquement."],
            ].map(([n, c, t, d]) => `
            <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="width:32px;vertical-align:top">
                  <span style="display:inline-block;width:26px;height:26px;border-radius:50%;background:${c};color:#fff;text-align:center;line-height:26px;font-size:12px;font-weight:700">${n}</span>
                </td>
                <td style="padding-left:12px">
                  <p style="margin:0 0 2px;font-weight:600;color:#0F2C59;font-size:13px">${t}</p>
                  <p style="margin:0;color:#64748B;font-size:12px">${d}</p>
                </td>
              </tr></table>
            </td></tr>`).join("")}
          </table>

          <!-- CTA -->
          <table cellpadding="0" cellspacing="0" style="margin:0 0 24px">
            <tr><td style="border-radius:8px;background:#0047AB">
              <a href="${siteUrl}/guide" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none">
                Voir le guide de démarrage →
              </a>
            </td></tr>
          </table>

          <p style="margin:0;color:#94A3B8;font-size:12px;line-height:1.6">
            Besoin d'aide ? Répondez à cet email ou ouvrez le chat depuis l'application.<br>
            Vous recevrez un rappel 3 jours avant la fin de votre essai.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#F8FAFC;padding:16px 32px;border-top:1px solid #E2E8F0">
          <p style="margin:0;color:#94A3B8;font-size:11px;text-align:center">
            GestionPark · contact@gestionpark.fr<br>
            Vous recevez cet email car vous venez de créer un compte sur gestionpark.fr.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`,
  });
}

export async function envoyerEmailQuittance(
  destinataire: string,
  opts: {
    locataireNom: string;
    mois: number;
    annee: number;
    pdfBuffer: Buffer;
    filename: string;
    bailleurNom?: string | null;
    bailleurEmail: string;
  }
): Promise<void> {
  if (isDemoAddress(destinataire)) return;
  if (!process.env.RESEND_API_KEY) throw new EmailNonConfigure("RESEND_API_KEY absente.");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const moisLabel = new Date(opts.annee, opts.mois - 1).toLocaleString("fr-FR", { month: "long" });
  const subject = `Quittance de loyer — ${moisLabel} ${opts.annee}`;
  const html = `
    <p>Bonjour ${opts.locataireNom},</p>
    <p>Veuillez trouver ci-joint votre quittance de loyer pour le mois de <strong>${moisLabel} ${opts.annee}</strong>.</p>
    <br>
    <p>${opts.bailleurNom ?? opts.bailleurEmail}</p>
  `;
  await resend.emails.send({
    from: EMAIL_FROM,
    to: destinataire,
    subject,
    html,
    text: html.replace(/<[^>]+>/g, ""),
    attachments: [{ filename: opts.filename, content: opts.pdfBuffer }],
  });
}

export async function envoyerEmailRappelEssai(
  destinataire: string,
  opts: { joursRestants: number }
): Promise<void> {
  if (isDemoAddress(destinataire)) return;
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const siteUrl = process.env.NEXT_PUBLIC_URL ?? "https://gestionpark.fr";
  const j = opts.joursRestants;
  await resend.emails.send({
    from: EMAIL_FROM,
    to: destinataire,
    subject: `Votre essai GestionPark se termine dans ${j} jour${j > 1 ? "s" : ""}`,
    html: `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F8FF;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F8FF;padding:32px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
        <tr><td style="background:#0047AB;padding:28px 32px">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:1px">GESTIONPARK</p>
          <p style="margin:6px 0 0;color:rgba(255,255,255,.75);font-size:13px">Logiciel de gestion de boxs de stockage</p>
        </td></tr>
        <tr><td style="padding:32px">
          <h1 style="margin:0 0 8px;font-size:22px;color:#0F2C59">Votre essai se termine bientôt ⏰</h1>
          <p style="margin:0 0 20px;color:#64748B;font-size:14px;line-height:1.6">
            Il vous reste <strong>${j} jour${j > 1 ? "s" : ""}</strong> sur votre période d'essai gratuit. Pour continuer à gérer vos boxes sans interruption, activez votre abonnement.
          </p>
          <table cellpadding="0" cellspacing="0" style="margin:0 0 24px">
            <tr><td style="border-radius:8px;background:#0047AB">
              <a href="${siteUrl}/abonnement" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none">
                Activer mon abonnement →
              </a>
            </td></tr>
          </table>
          <p style="margin:0 0 8px;color:#64748B;font-size:13px;line-height:1.6">
            <strong>Rappel :</strong> toutes vos données (biens, locataires, historique) sont conservées lors du passage à l'abonnement.
          </p>
          <p style="margin:0;color:#94A3B8;font-size:12px">
            Des questions ? Répondez à cet email ou ouvrez le chat depuis l'application.
          </p>
        </td></tr>
        <tr><td style="background:#F8FAFC;padding:16px 32px;border-top:1px solid #E2E8F0">
          <p style="margin:0;color:#94A3B8;font-size:11px;text-align:center">
            GestionPark · contact@gestionpark.fr
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
  });
}

export async function envoyerEmailRevisionIRL(
  destinataire: string,
  opts: {
    locataireNom: string;
    locatairePrenom: string;
    bienNom: string;
    boxNumero: string;
    dateRevision: Date;
    loyerActuel: number;
    bailleurNom?: string | null;
  }
): Promise<void> {
  if (isDemoAddress(destinataire)) return;
  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const dateLabel = new Date(opts.dateRevision).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  const loyerLabel = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(opts.loyerActuel);
  const subject = `Révision de votre loyer — ${dateLabel}`;
  const html = `
    <p>Bonjour ${opts.locatairePrenom} ${opts.locataireNom},</p>
    <p>Nous vous informons que votre loyer pour le box <strong>${opts.boxNumero}</strong> (${opts.bienNom}) fera l'objet d'une révision annuelle à compter du <strong>${dateLabel}</strong>, conformément à l'Indice de Référence des Loyers (IRL).</p>
    <p>Votre loyer actuel est de <strong>${loyerLabel}/mois</strong>.</p>
    <p>Vous recevrez prochainement le détail du montant révisé.</p>
    <br>
    <p>${opts.bailleurNom ?? "Votre bailleur"}</p>
  `;
  await resend.emails.send({
    from: EMAIL_FROM,
    to: destinataire,
    subject,
    html,
    text: html.replace(/<[^>]+>/g, ""),
  });
}

export async function envoyerEmailResetMotDePasse(destinataire: string, lien: string): Promise<void> {
  if (isDemoAddress(destinataire)) return;
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
