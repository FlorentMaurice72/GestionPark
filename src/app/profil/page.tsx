import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfilInfosForm } from "./_components/ProfilInfosForm";
import { ProfilMdpForm } from "./_components/ProfilMdpForm";

export const dynamic = "force-dynamic";

function libellePlan(plan: string) {
  if (plan === "pro") return "Pro";
  return "Essentiel";
}

function libelleStatut(statut: string) {
  switch (statut) {
    case "active": return "Actif";
    case "trialing": return "Période d'essai";
    case "past_due": return "Paiement en retard";
    case "canceled": return "Annulé";
    default: return statut;
  }
}

function couleurStatut(statut: string) {
  switch (statut) {
    case "active": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "trialing": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "past_due": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    default: return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
  }
}

export default async function ProfilPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const admin = await prisma.admin.findUnique({
    where: { id: parseInt(session.user.id) },
    select: {
      email: true,
      nomBailleur: true,
      adresseBailleur: true,
      subscriptionStatus: true,
      subscriptionPlan: true,
      trialEndsAt: true,
      subscriptionCurrentPeriodEnd: true,
    },
  });

  if (!admin) redirect("/login");

  const joursEssaiRestants = admin.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(admin.trialEndsAt).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Mon compte</h1>

      {/* Abonnement */}
      <section className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-4 text-base font-semibold text-neutral-900 dark:text-neutral-100">Abonnement</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Email</span>
            <span className="font-medium text-neutral-900 dark:text-neutral-100">{admin.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Plan</span>
            <span className="font-medium text-neutral-900 dark:text-neutral-100">{libellePlan(admin.subscriptionPlan)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Statut</span>
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${couleurStatut(admin.subscriptionStatus)}`}>
              {libelleStatut(admin.subscriptionStatus)}
            </span>
          </div>
          {admin.subscriptionStatus === "trialing" && joursEssaiRestants !== null && (
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Essai restant</span>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {joursEssaiRestants} jour{joursEssaiRestants !== 1 ? "s" : ""}
              </span>
            </div>
          )}
          {admin.subscriptionCurrentPeriodEnd && admin.subscriptionStatus === "active" && (
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Prochain renouvellement</span>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {new Date(admin.subscriptionCurrentPeriodEnd).toLocaleDateString("fr-FR")}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Informations bailleur */}
      <section className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">Informations bailleur</h2>
        <p className="mb-4 text-xs text-neutral-500">Ces informations apparaissent sur vos quittances de loyer.</p>
        <ProfilInfosForm nomBailleur={admin.nomBailleur} adresseBailleur={admin.adresseBailleur} />
      </section>

      {/* Sécurité */}
      <section className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-4 text-base font-semibold text-neutral-900 dark:text-neutral-100">Sécurité</h2>
        <ProfilMdpForm />
      </section>
    </div>
  );
}
