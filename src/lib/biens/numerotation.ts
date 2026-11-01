// Génère une numérotation séquentielle de boxes du type "1" à "22" ou
// "1B" à "12B" (préfixe/suffixe optionnels autour d'un entier croissant).
export interface ParametresNumerotation {
  prefixe: string;
  numeroDebut: number;
  nombreBoxes: number;
  suffixe: string;
}

export function genererNumeros(params: ParametresNumerotation): string[] {
  const numeros: string[] = [];
  for (let i = 0; i < params.nombreBoxes; i += 1) {
    numeros.push(`${params.prefixe}${params.numeroDebut + i}${params.suffixe}`);
  }
  return numeros;
}
