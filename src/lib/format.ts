const formatteurMontant = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

export function formaterMontant(montant: number): string {
  return formatteurMontant.format(montant);
}

export function formaterPourcentage(ratio: number | null): string {
  if (ratio === null) return "—";
  return new Intl.NumberFormat("fr-FR", { style: "percent", maximumFractionDigits: 1 }).format(ratio);
}
