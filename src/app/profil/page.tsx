import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppNavWrapper } from "@/components/AppNavWrapper";
import { DeconnexionButton } from "@/components/DeconnexionButton";
import { ProfilTabNav } from "./_components/ProfilTabNav";
import { ProfilInfosForm } from "./_components/ProfilInfosForm";
import { ProfilMdpForm } from "./_components/ProfilMdpForm";
import { ProfilFacturationClient } from "./_components/ProfilFacturationClient";

export const dynamic = "force-dynamic";

function libellePlan(plan: string) {
  if (plan === "pro") return "Pro";
  return "Essentiel";
}

function libelleStatut(statut: string) {
  switch (statut) {
    case "active":    return "Actif";
    case "trialing":  return "Période d'essai";
    case "past_due":  return "Paiement en retard";
    case "canceled":  return "Annulé";
    default:          return statut;
  }
}

function couleurStatut(statut: string) {
  switch (statut) {
    case "active":   return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "trialing": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "past_due": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    default:         return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
  }
}

function fmt(d: Date | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

export default async function ProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ onglet?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const admin = await prisma.admin.findUnique({
    where: { id: parseInt(session.user.id) },
    select: {
      email: true,
      nomBailleur: true,
      adresseBailleur: true,
      createdAt: true,
      subscriptionStatus: true,
      subscriptionPlan: true,
      trialEndsAt: true,
      stripeCustomerId: true,
      subscriptionCurrentPeriodEnd: true,
    },
  });
  if (!admin) redirect("/login");

  const { onglet = "compte" } = await searchParams;

  const joursEssaiRestants = admin.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(admin.trialEndsAt).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <AppNavWrapper />

      {/* En-tête page */}
      <div className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Mon compte</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{admin.email}</p>
          </div>
          <DeconnexionButton />
        </div>
        <Suspense fallback={null}>
          <ProfilTabNav />
        </Suspense>
      </div>

      {/* Contenu */}
      <main className="mx-auto max-w-3xl px-6 py-8">

        {/* ── Onglet : Mon compte ── */}
        {onglet === "compte" && (
          <div className="space-y-6">

            {/* Informations bailleur */}
            <section className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="mb-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Informations bailleur
              </h2>
              <p className="mb-5 text-xs text-neutral-500">
                Ces informations apparaissent sur vos quittances de loyer.
              </p>
              <ProfilInfosForm nomBailleur={admin.nomBailleur} adresseBailleur={admin.adresseBailleur} />
            </section>

            {/* Coordonnées */}
            <section className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="mb-5 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Coordonnées
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-500">Adresse e-mail</label>
                  <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    <span>{admin.email}</span>
                    <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
                      Vérifiée
                    </span>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-500">Membre depuis</label>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">{fmt(admin.createdAt)}</p>
                </div>
              </div>
            </section>

            {/* Sécurité */}
            <section className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="mb-5 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Mot de passe
              </h2>
              <ProfilMdpForm />
            </section>
          </div>
        )}

        {/* ── Onglet : Facturation ── */}
        {onglet === "facturation" && (
          <div className="space-y-6">

            {/* Abonnement actuel */}
            <section className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="mb-5 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Abonnement
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Formule</span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {libellePlan(admin.subscriptionPlan)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Statut</span>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${couleurStatut(admin.subscriptionStatus)}`}>
                    {libelleStatut(admin.subscriptionStatus)}
                  </span>
                </div>
                {admin.subscriptionStatus === "trialing" && joursEssaiRestants !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Fin de l&apos;essai</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {fmt(admin.trialEndsAt)} · <span className="text-neutral-500">{joursEssaiRestants} jour{joursEssaiRestants !== 1 ? "s" : ""} restant{joursEssaiRestants !== 1 ? "s" : ""}</span>
                    </span>
                  </div>
                )}
                {admin.subscriptionCurrentPeriodEnd && admin.subscriptionStatus === "active" && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Prochain renouvellement</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {fmt(admin.subscriptionCurrentPeriodEnd)}
                    </span>
                  </div>
                )}
              </div>

              {/* Séparateur */}
              <div className="my-5 border-t border-neutral-100 dark:border-neutral-800" />

              <ProfilFacturationClient hasStripeCustomer={!!admin.stripeCustomerId} />
            </section>

            {/* ID client */}
            {admin.stripeCustomerId && (
              <p className="text-xs text-neutral-400 dark:text-neutral-600">
                ID client : {admin.stripeCustomerId}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
