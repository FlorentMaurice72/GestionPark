import { auth } from "@/lib/auth";
import { getNombreAlertesUrgentes } from "@/lib/alertes/data";
import { AppNav } from "./AppNav";

export async function AppNavWrapper() {
  const session = await auth();
  let nombreUrgentes = 0;
  if (session?.user?.id) {
    nombreUrgentes = await getNombreAlertesUrgentes(parseInt(session.user.id));
  }
  return <AppNav nombreUrgentes={nombreUrgentes} />;
}
