"use client";

import Link from "next/link";
import { useState } from "react";
import type { Notification } from "@/lib/dashboard/data";

// Pas d'état lu/non-lu persisté : les notifications sont recalculées à
// chaque chargement depuis les faits en base (impayés, non-identifiés).
// Le badge reflète toujours le nombre de catégories actives ; cliquer une
// notification navigue vers l'action qui la fait disparaître (payer,
// relancer, assigner) — pas un simple marquage "lu" (cf. journal de
// décisions Phase 7).
export function NotificationBell({ notifications }: { notifications: Notification[] }) {
  const [ouvert, setOuvert] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        aria-label="Notifications"
        className="relative rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <BellIcon />
        {notifications.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-medium text-white">
            {notifications.length}
          </span>
        )}
      </button>

      {ouvert && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOuvert(false)} />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-neutral-500">Aucune notification.</p>
            ) : (
              <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {notifications.map((notification, i) => (
                  <li key={`${notification.type}-${i}`}>
                    <Link
                      href={notification.lien}
                      onClick={() => setOuvert(false)}
                      className="flex items-start gap-2 p-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    >
                      <span
                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                          notification.priorite === "haute" ? "bg-red-600" : "bg-amber-500"
                        }`}
                      />
                      <span className="text-neutral-800 dark:text-neutral-200">{notification.message}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function BellIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-neutral-700 dark:text-neutral-300"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
