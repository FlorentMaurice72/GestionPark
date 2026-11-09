import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Programme de parrainage — GestionPark",
  description: "Parrainez un ami propriétaire de boxs et recevez 1 mois offert. Sans limite de parrainages.",
};

function CopyScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          document.querySelectorAll('.copy-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
              var text = btn.getAttribute('data-copy');
              if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(function() {
                  var orig = btn.textContent;
                  btn.textContent = 'Copié !';
                  setTimeout(function() { btn.textContent = orig; }, 1500);
                });
              }
            });
          });
        `,
      }}
    />
  );
}

export default async function ParrainagePage() {
  const session = await auth();
  let referralCode: string | null = null;
  if (session?.user?.id) {
    const admin = await prisma.admin.findUnique({
      where: { id: parseInt(session.user.id) },
      select: { referralCode: true },
    });
    referralCode = admin?.referralCode ?? null;
  }
  const siteUrl = process.env.NEXT_PUBLIC_URL ?? "https://gestionpark.fr";
  const lienParrainage = referralCode ? `${siteUrl}/signup?ref=${referralCode}` : null;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 py-16">
      <div className="mx-auto max-w-2xl">

        <p className="mb-8">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
            ← Retour
          </Link>
        </p>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full text-3xl" style={{ background: "#EEF4FF" }}>
            🎁
          </div>
          <h1 className="mb-3 text-3xl font-bold text-neutral-900 dark:text-neutral-100" style={{ fontFamily: "var(--font-montserrat)" }}>
            Parrainez, et profitez ensemble
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg">
            Chaque ami que vous parrainez vous rapporte <strong className="text-neutral-900 dark:text-neutral-100">1 mois offert</strong>.
            Votre filleul reçoit lui aussi <strong className="text-neutral-900 dark:text-neutral-100">1 mois offert</strong> à l'inscription.
          </p>
        </div>

        {/* Comment ça marche */}
        <div className="mb-10 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-6 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Comment ça marche ?</h2>
          <div className="flex flex-col gap-5">
            {[
              { n: "1", couleur: "#0047AB", titre: "Partagez votre lien", desc: "Copiez votre lien personnel et envoyez-le à vos contacts propriétaires de boxs." },
              { n: "2", couleur: "#0097A7", titre: "Votre filleul s'inscrit", desc: "Il crée son compte GestionPark via votre lien et démarre son essai gratuit + 1 mois offert." },
              { n: "3", couleur: "#20B2AA", titre: "Vous recevez 1 mois offert", desc: "Dès que son abonnement est actif, votre prochain mois est automatiquement offert." },
            ].map((e) => (
              <div key={e.n} className="flex gap-4">
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: e.couleur }}
                >
                  {e.n}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">{e.titre}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code personnel ou CTA connexion */}
        {lienParrainage ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="mb-4 text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Votre lien de parrainage
            </h2>
            <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
              Partagez ce lien à vos contacts propriétaires de boxs :
            </p>
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
              <code className="flex-1 truncate text-sm text-neutral-700 dark:text-neutral-300">
                {lienParrainage}
              </code>
              <button
                type="button"
                onClick={undefined}
                data-copy={lienParrainage}
                className="copy-btn flex-shrink-0 rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900"
              >
                Copier
              </button>
            </div>
            <p className="text-xs text-neutral-400">
              Code personnel : <strong className="text-neutral-600 dark:text-neutral-300">{referralCode}</strong>
            </p>
            <CopyScript />
          </div>
        ) : (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
              Connectez-vous pour obtenir votre lien de parrainage personnel.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: "#0047AB" }}
            >
              Se connecter →
            </Link>
          </div>
        )}

        {/* FAQ */}
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Questions fréquentes</h2>
          <div className="flex flex-col gap-3">
            {[
              {
                q: "Est-ce qu'il y a une limite de parrainages ?",
                r: "Non, vous pouvez parrainer autant d'amis que vous le souhaitez. Chaque parrainage validé vous rapporte 1 mois offert.",
              },
              {
                q: "Quand est-ce que je reçois mon mois offert ?",
                r: "Le mois offert est crédité sur votre compte dès que votre filleul souscrit à un abonnement payant.",
              },
              {
                q: "Le programme fonctionne-t-il avec l'essai gratuit ?",
                r: "Votre filleul reçoit son mois offert en plus de l'essai gratuit de 14 jours. Vous recevez le vôtre uniquement quand il passe en abonnement.",
              },
            ].map((faq, i) => (
              <details key={i} className="group rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {faq.q}
                  <span className="ml-2 flex-shrink-0 text-neutral-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="border-t border-neutral-100 dark:border-neutral-800 px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">{faq.r}</p>
              </details>
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-neutral-400">
          Des questions ?{" "}
          <a href="mailto:contact@gestionpark.fr" className="underline hover:text-neutral-700 dark:hover:text-neutral-200">
            contact@gestionpark.fr
          </a>
        </p>

      </div>
    </div>
  );
}
