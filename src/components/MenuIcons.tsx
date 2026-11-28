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

/**
 * Onboarding welcome rocket — a storage box launching like a rocket,
 * unique to GestionPark (warehouse box body + nose cone + boosters + flame).
 * Filled, brand colors: #0047AB (cobalt), #20B2AA (teal), #F59E0B (amber flame).
 */
export function OnboardingRocket({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 54" fill="none" aria-hidden>
      {/* Nose cone — teal roof of the box */}
      <path d="M10 22 L24 4 L38 22Z" fill="#20B2AA" />
      {/* Box body — cobalt storage unit */}
      <rect x="10" y="21" width="28" height="20" rx="2.5" fill="#0047AB" />
      {/* Box door / window panel */}
      <rect x="18" y="27" width="12" height="10" rx="1.5" fill="white" fillOpacity={0.18} />
      {/* Door handle */}
      <line x1="24" y1="30" x2="24" y2="34" stroke="white" strokeWidth={1.5} strokeOpacity={0.5} strokeLinecap="round" />
      {/* Left booster */}
      <rect x="2" y="28" width="8" height="10" rx="1.5" fill="#0097A7" />
      {/* Right booster */}
      <rect x="38" y="28" width="8" height="10" rx="1.5" fill="#0097A7" />
      {/* Left fin */}
      <path d="M2 36 L-1 44 L10 40Z" fill="#0047AB" />
      {/* Right fin */}
      <path d="M46 36 L49 44 L38 40Z" fill="#0047AB" />
      {/* Main flame */}
      <path d="M15 41 Q19 52 24 46 Q29 54 33 41" fill="#F59E0B" />
      {/* Left booster flame */}
      <path d="M4 38 Q6 44 6 41 Q7 46 8 38" fill="#FCD34D" />
      {/* Right booster flame */}
      <path d="M40 38 Q42 44 42 41 Q43 46 44 38" fill="#FCD34D" />
      {/* Star sparkles */}
      <circle cx="6" cy="12" r="1.5" fill="#FCD34D" />
      <circle cx="40" cy="8" r="1" fill="#20B2AA" />
      <circle cx="43" cy="20" r="1.5" fill="#FCD34D" />
      <circle cx="4" cy="22" r="1" fill="#20B2AA" />
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
