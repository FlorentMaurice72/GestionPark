import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/admin-dashboard/data";

export const metadata = { title: "Admin — GestionPark" };
export const dynamic = "force-dynamic";

const STATUT_LABEL: Record<string, { label: string; className: string }> = {
  active:    { label: "Payant",    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  trialing:  { label: "Essai",     className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  trial:     { label: "Essai",     className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  canceled:  { label: "Résilié",   className: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400" },
  past_due:  { label: "En retard", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  incomplete:{ label: "Incomplet", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
};

function Badge({ statut }: { statut: string | null }) {
  const s = STATUT_LABEL[statut ?? ""] ?? { label: statut ?? "—", className: "bg-neutral-100 text-neutral-500" };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${s.className}`}>
      {s.label}
    </span>
  );
}

function fmt(date: Date) {
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function AdminPage() {
  const session = await auth();
  const ownerEmail = process.env.OWNER_EMAIL;

  if (!session || !ownerEmail || session.user?.email !== ownerEmail) {
    redirect("/");
  }

  const d = await getAdminDashboardData();
  const maxJour = Math.max(...d.inscriptionsParJour.map((j) => j.count), 1);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-16">
      <header className="border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Admin — Tableau de bord
            </h1>
            <p className="text-xs text-neutral-500">Vue réservée — accès restreint</p>
          </div>
          <Link
            href="/"
            className="text-sm text-neutral-500 underline hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            ← Retour à l&apos;application
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">

        {/* ── KPIs ───────────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Vue d&apos;ensemble</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { label: "MRR", value: `${d.mrr.toFixed(2).replace(".", ",")} €`, accent: true },
              { label: "Total inscrits", value: String(d.totalInscrits) },
              { label: "Payants", value: String(d.payants), color: "text-green-600 dark:text-green-400" },
              { label: "En essai", value: String(d.enEssai), color: "text-blue-600 dark:text-blue-400" },
              { label: "Résiliés", value: String(d.resilies), color: "text-neutral-500" },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <p className="text-xs text-neutral-500">{kpi.label}</p>
                <p className={`mt-1 text-2xl font-bold ${kpi.color ?? (kpi.accent ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-900 dark:text-neutral-100")}`}>
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Plans ──────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { label: "Essentiel (9,90 €/mois)", count: d.essentielCount, color: "#0097A7" },
            { label: "Pro (24,90 €/mois)",      count: d.proCount,       color: "#0047AB" },
          ].map((plan) => (
            <div
              key={plan.label}
              className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: plan.color }}
                />
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {plan.label}
                </span>
              </div>
              <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {plan.count}
              </span>
            </div>
          ))}
        </section>

        {/* ── Inscriptions 30 jours ──────────────────────────────────── */}
        {d.inscriptionsParJour.length > 0 && (
          <section>
            <h2 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Inscriptions — 30 derniers jours ({d.inscriptionsParJour.reduce((s, j) => s + j.count, 0)} nouveaux)
            </h2>
            <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex h-28 items-end gap-1 overflow-x-auto">
                {d.inscriptionsParJour.map((jour) => (
                  <div key={jour.date} className="group relative flex flex-1 flex-col items-center">
                    <div
                      className="w-full min-w-[6px] rounded-t"
                      style={{
                        height: `${Math.round((jour.count / maxJour) * 96)}px`,
                        backgroundColor: "#0047AB",
                        opacity: 0.75,
                      }}
                      title={`${jour.date} — ${jour.count} inscrit${jour.count > 1 ? "s" : ""}`}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-right text-xs text-neutral-400">
                {d.inscriptionsParJour[0]?.date} → {d.inscriptionsParJour[d.inscriptionsParJour.length - 1]?.date}
              </p>
            </div>
          </section>
        )}

        {/* ── Essais expirant dans 7 jours ───────────────────────────── */}
        {d.expirationsProchaines.length > 0 && (
          <section>
            <h2 className="mb-4 text-sm font-semibold text-amber-700 dark:text-amber-400">
              Essais expirant dans 7 jours ({d.expirationsProchaines.length})
            </h2>
            <div className="overflow-hidden rounded-xl border border-amber-200 bg-white dark:border-amber-900/40 dark:bg-neutral-900">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-neutral-800">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500">Email</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500">Expire le</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500">Jours restants</th>
                  </tr>
                </thead>
                <tbody>
                  {d.expirationsProchaines.map((e, i) => (
                    <tr key={e.id} className={i < d.expirationsProchaines.length - 1 ? "border-b border-neutral-100 dark:border-neutral-800" : ""}>
                      <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{e.email}</td>
                      <td className="px-4 py-3 text-right text-neutral-500">{fmt(e.trialEndsAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-semibold ${e.joursRestants <= 2 ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"}`}>
                          J‑{e.joursRestants}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Derniers inscrits ──────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            Derniers inscrits
          </h2>
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500">Plan</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500">Inscrit le</th>
                </tr>
              </thead>
              <tbody>
                {d.recentInscrits.map((u, i) => (
                  <tr key={u.id} className={i < d.recentInscrits.length - 1 ? "border-b border-neutral-100 dark:border-neutral-800" : ""}>
                    <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <Badge statut={u.subscriptionStatus} />
                    </td>
                    <td className="px-4 py-3 capitalize text-neutral-500">
                      {u.subscriptionPlan ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-neutral-500">
                      {fmt(u.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {d.enRetard > 0 && (
          <p className="text-sm text-red-600 dark:text-red-400">
            ⚠ {d.enRetard} compte{d.enRetard > 1 ? "s" : ""} en impayé Stripe (past_due) — vérifier dans le dashboard Stripe.
          </p>
        )}

      </main>
    </div>
  );
}
