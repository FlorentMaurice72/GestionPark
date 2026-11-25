import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppNavWrapper } from "@/components/AppNavWrapper";
import { OngletsGestionLocative } from "../_components/OngletsGestionLocative";
import { BanqueClient } from "./_components/BanqueClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Connexion bancaire — GestionPark" };

export default async function BanquePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  const userId = parseInt(session.user!.id!);
  const params = await searchParams;

  const [connections, transactionsNR, locations, adminRow] = await Promise.all([
    prisma.bankConnection.findMany({
      where: { adminId: userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.bankTransaction.findMany({
      where: { adminId: userId, statut: "non_rapproche" },
      orderBy: { date: "desc" },
      take: 100,
    }),
    prisma.location.findMany({
      where: { box: { bien: { utilisateurId: userId } }, statut: "actif" },
      select: {
        id: true,
        loyerActuel: true,
        box: { select: { numero: true } },
        locataire: { select: { nom: true, prenom: true } },
      },
      orderBy: { box: { numero: "asc" } },
    }),
    prisma.admin.findUnique({
      where: { id: userId },
      select: { subscriptionPlan: true, subscriptionStatus: true },
    }),
  ]);

  const estPro =
    adminRow?.subscriptionPlan === "pro" &&
    ["active", "trialing", "trial"].includes(adminRow?.subscriptionStatus ?? "");

  const messageInit =
    params.connexion === "ok" ? ("ok" as const) : (params.erreur ?? null);

  return (
    <div className="min-h-screen bg-neutral-50 pb-16 dark:bg-neutral-950 md:pb-0">
      <AppNavWrapper />
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6">
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Gestion locative</h1>
        <OngletsGestionLocative ongletActif="paiements" />
      </header>
      <BanqueClient
        connections={connections.map((c) => ({
          id: c.id,
          institutionName: c.institutionName,
          institutionLogo: c.institutionLogo ?? null,
          statut: c.statut,
          lastSyncAt: c.lastSyncAt?.toISOString() ?? null,
          accountCount: c.accountIds.length,
        }))}
        transactions={transactionsNR.map((t) => ({
          id: t.id,
          date: t.date.toISOString().slice(0, 10),
          montant: parseFloat(t.montant.toString()),
          libelle: t.libelle,
          mois: t.mois ?? 0,
          annee: t.annee ?? 0,
        }))}
        locations={locations.map((l) => ({
          id: l.id,
          boxNumero: l.box.numero,
          locataireNom: `${l.locataire.prenom} ${l.locataire.nom}`,
          loyerActuel: parseFloat(l.loyerActuel.toString()),
        }))}
        estPro={estPro}
        messageInit={messageInit}
      />
    </div>
  );
}
