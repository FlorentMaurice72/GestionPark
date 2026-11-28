"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  userEmail: string;
  open: boolean;
  onClose: () => void;
}

const TYPES = ["Bug", "Suggestion", "Question", "Autre"];

export function FeedbackModal({ userEmail, open, onClose }: Props) {
  const [type, setType] = useState("Suggestion");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setStatus("idle");
      setMessage("");
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length < 5 || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal
        aria-labelledby="feedback-title"
        className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-md -translate-y-1/2 rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="feedback-title" className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Faire une remontée
          </h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="text-4xl">✅</span>
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">Message envoyé !</p>
            <p className="text-sm text-neutral-500">Merci pour votre retour. Nous reviendrons vers vous dès que possible.</p>
            <button
              onClick={onClose}
              className="mt-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Type de remontée
              </label>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                      type === t
                        ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                        : "border-neutral-300 text-neutral-600 hover:border-neutral-500 dark:border-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="feedback-message" className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Votre message
              </label>
              <textarea
                id="feedback-message"
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Décrivez votre problème, suggestion ou question…"
                required
                minLength={5}
                className="w-full resize-none rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:ring-neutral-400"
              />
            </div>

            <p className="text-xs text-neutral-400">
              Envoyé depuis le compte <span className="font-medium">{userEmail}</span>
            </p>

            {status === "error" && (
              <p className="text-sm text-red-600 dark:text-red-400">
                Une erreur s&apos;est produite. Veuillez réessayer.
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={status === "sending" || message.trim().length < 5}
                className="flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
              >
                {status === "sending" && (
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {status === "sending" ? "Envoi…" : "Envoyer"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
