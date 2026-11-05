import { auth, signOut } from "@/lib/auth";
import { getNombreAlertesUrgentes } from "@/lib/alertes/data";
import { AppNav } from "./AppNav";

export async function AppNavWrapper() {
  const session = await auth();
  let nombreUrgentes = 0;
  if (session?.user?.id) {
    nombreUrgentes = await getNombreAlertesUrgentes(parseInt(session.user.id));
  }

  const signOutForm = (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <button
        type="submit"
        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        <span className="text-base">🚪</span>
        Se déconnecter
      </button>
    </form>
  );

  return (
    <AppNav
      nombreUrgentes={nombreUrgentes}
      userEmail={session?.user?.email ?? ""}
      signOutForm={signOutForm}
    />
  );
}
