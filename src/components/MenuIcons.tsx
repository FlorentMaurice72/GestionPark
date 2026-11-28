/**
 * Custom icons & illustrations — GestionPark originals.
 * Menu icons: stroke-based, 24×24 viewBox, strokeWidth 1.5, rounded caps/joins.
 * Onboarding illustrations: filled, brand colors.
 */

interface IconProps {
  className?: string;
}

/** Mon profil — landlord silhouette with a property key badge */
export function MenuIconProfil({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Person bust */}
      <circle cx="9.5" cy="7" r="3.5" />
      <path d="M2 21c0-4.1 3.4-7.5 7.5-7.5" />
      {/* Key badge — represents property ownership */}
      <circle cx="18" cy="14.5" r="2.5" />
      <line x1="20.5" y1="14.5" x2="23" y2="14.5" />
      <line x1="22" y1="14.5" x2="22" y2="16.5" />
      <line x1="23" y1="14.5" x2="23" y2="16" />
    </svg>
  );
}

/** Paramètres du compte — three horizontal equalizer sliders */
export function MenuIconParametres({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Top slider — handle at left */}
      <line x1="3" y1="6" x2="21" y2="6" />
      <circle cx="7" cy="6" r="2.5" fill="white" stroke="currentColor" strokeWidth={1.5} />
      {/* Middle slider — handle at right */}
      <line x1="3" y1="12" x2="21" y2="12" />
      <circle cx="16" cy="12" r="2.5" fill="white" stroke="currentColor" strokeWidth={1.5} />
      {/* Bottom slider — handle at center */}
      <line x1="3" y1="18" x2="21" y2="18" />
      <circle cx="11" cy="18" r="2.5" fill="white" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  );
}

/** Abonnement — credit card with chip detail */
export function MenuIconAbonnement({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Card body */}
      <rect x="2" y="5" width="20" height="14" rx="2.5" />
      {/* Magnetic stripe */}
      <line x1="2" y1="10" x2="22" y2="10" strokeWidth={3} strokeOpacity={0.2} />
      <line x1="2" y1="10" x2="22" y2="10" />
      {/* Chip */}
      <rect x="5" y="13" width="4.5" height="3" rx="0.75" />
      {/* Card number dots */}
      <circle cx="14" cy="14.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="14.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="19" cy="14.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Parrainer un ami — two people with a star gift between them */
export function MenuIconParrainage({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Left person */}
      <circle cx="6.5" cy="6.5" r="2.75" />
      <path d="M1 20c0-3.1 2.4-5.5 5.5-5.5" />
      {/* Right person */}
      <circle cx="17.5" cy="6.5" r="2.75" />
      <path d="M23 20c0-3.1-2.4-5.5-5.5-5.5" />
      {/* Gift / star connecting them */}
      <path d="M12 10 l1 2.5h2.6l-2.1 1.6.8 2.6L12 15.2l-2.3 1.5.8-2.6-2.1-1.6H11Z" />
    </svg>
  );
}

/** Faire une remontée — speech bubble with upward arrow (escalation) */
export function MenuIconFeedback({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Speech bubble */}
      <path d="M4 3h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H7.5L4 18V4a1 1 0 0 1 1-1h-1Z" />
      <path d="M5 4h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H7l-3 3V5a1 1 0 0 1 1-1Z" />
      {/* Upward arrow inside */}
      <line x1="12" y1="11" x2="12" y2="6" />
      <polyline points="9 8.5 12 5.5 15 8.5" />
    </svg>
  );
}

/** Se déconnecter — door with outward arrow (logout) */
export function MenuIconDeconnexion({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Door frame */}
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      {/* Arrow exiting */}
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

// ── Onboarding illustrations ──────────────────────────────────────────────────

/** GestionPark logo mark — same SVG as the top nav logo */
export function GestionParkLogo({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 80 60" aria-hidden>
      <polygon points="30,4 50,14 30,24 10,14" fill="#20B2AA" />
      <polygon points="10,14 30,24 30,42 10,32" fill="#0097A7" />
      <polygon points="30,24 50,14 50,32 30,42" fill="#0047AB" />
      <polygon points="50,18 62,24 50,30 38,24" fill="#20B2AA" />
      <polygon points="50,30 62,24 62,38 50,44" fill="#0047AB" />
      <circle cx="26" cy="40" r="8" fill="#0097A7" />
      <circle cx="26" cy="40" r="3.5" fill="white" />
      <rect x="32" y="37" width="17" height="5" rx="2" fill="#0097A7" />
    </svg>
  );
}

/** Step icon — Ajoutez votre premier bien (warehouse building outline) */
export function OnboardingIconBien({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Building walls */}
      <rect x="2" y="8" width="20" height="13" rx="1" />
      {/* Roof */}
      <path d="M1 8 L12 2 L23 8" />
      {/* Door/shutter */}
      <rect x="8" y="13" width="8" height="8" rx="0.5" />
      {/* Handle */}
      <line x1="12" y1="16" x2="12" y2="18" strokeWidth={1.5} />
    </svg>
  );
}

/** Step icon — Créez votre premier locataire (person with a document/lease) */
export function OnboardingIconLocataire({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Person */}
      <circle cx="9" cy="7" r="4" />
      <path d="M2 21c0-3.9 3.1-7 7-7" />
      {/* Document/lease */}
      <rect x="14" y="11" width="9" height="11" rx="1.5" />
      <line x1="16.5" y1="15" x2="20.5" y2="15" />
      <line x1="16.5" y1="18" x2="20.5" y2="18" />
    </svg>
  );
}

/** Step icon — Importez vos relevés bancaires (file with downward import arrow) */
export function OnboardingIconImport({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* File outline */}
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <polyline points="14 2 14 8 20 8" />
      {/* Import arrow */}
      <line x1="12" y1="11" x2="12" y2="17" />
      <polyline points="9 14.5 12 17.5 15 14.5" />
    </svg>
  );
}
