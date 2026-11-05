import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex flex-wrap justify-center gap-4 border-t border-neutral-200 bg-white px-6 py-3 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
      <Link href="/mentions-legales" className="hover:text-neutral-900 dark:hover:text-neutral-100">
        Mentions légales
      </Link>
      <Link href="/cgu" className="hover:text-neutral-900 dark:hover:text-neutral-100">
        CGU / CGV
      </Link>
      <Link href="/confidentialite" className="hover:text-neutral-900 dark:hover:text-neutral-100">
        Politique de confidentialité
      </Link>
    </footer>
  );
}
