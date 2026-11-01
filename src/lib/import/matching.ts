// Matching transaction bancaire -> Location, fonctions pures.
//
// Règle : une Location est candidate si un de ses matching_inputs apparaît
// comme sous-chaîne dans le libellé de la transaction, comparaison
// insensible à la casse et aux accents.

export interface LocationMatchable {
  id: number;
  matchingInputs: string[];
}

export type ResultatMatching =
  | { statut: "trouve"; locationId: number }
  | { statut: "aucune_correspondance" }
  | { statut: "correspondances_multiples"; locationIds: number[] };

// Plage Unicode des diacritiques combinants (accents détachés après
// normalisation NFD) — construite à partir des points de code (backslash-u
// explicite), les caractères combinants littéraux ne survivent pas de façon
// fiable à l'édition de fichiers.
function hex4(codePoint: number): string {
  return codePoint.toString(16).padStart(4, "0");
}

const DEBUT_DIACRITIQUES = 0x0300;
const FIN_DIACRITIQUES = 0x036f;
const DIACRITIQUES = new RegExp(
  `[\\u${hex4(DEBUT_DIACRITIQUES)}-\\u${hex4(FIN_DIACRITIQUES)}]`,
  "g",
);

export function normaliser(texte: string): string {
  return texte.normalize("NFD").replace(DIACRITIQUES, "").toLowerCase().trim();
}

export function trouverLocationCorrespondante(
  libelle: string,
  locations: LocationMatchable[],
): ResultatMatching {
  const libelleNormalise = normaliser(libelle);

  const correspondances = locations.filter((location) =>
    location.matchingInputs.some((input) => {
      const inputNormalise = normaliser(input);
      return inputNormalise.length > 0 && libelleNormalise.includes(inputNormalise);
    }),
  );

  if (correspondances.length === 0) {
    return { statut: "aucune_correspondance" };
  }
  if (correspondances.length === 1) {
    return { statut: "trouve", locationId: correspondances[0].id };
  }
  return { statut: "correspondances_multiples", locationIds: correspondances.map((l) => l.id) };
}
