// Seed idempotent des ImportPreset connus. Pas de contrainte unique sur
// `name` en base (décision : rester minimal, un seul preset utilisé pour
// l'instant) — l'idempotence est assurée ici en code, par un find-or-create.
//
// Usage : npm run seed-import-presets

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const PRESETS = [
  {
    name: "Crédit mutuel",
    delimiter: ";",
    columns: ["Date", "Date de valeur", "Debit", "Credit", "Libellé"],
    dateColumn: "Date",
    descriptionColumn: "Libellé",
    amountColumn: "Credit",
    hasHeaderRow: true,
  },
];

async function main() {
  for (const preset of PRESETS) {
    const existant = await prisma.importPreset.findFirst({ where: { name: preset.name } });
    if (existant) {
      console.log(`Preset "${preset.name}" déjà présent (id ${existant.id}), ignoré.`);
      continue;
    }
    const cree = await prisma.importPreset.create({ data: preset });
    console.log(`Preset "${preset.name}" créé (id ${cree.id}).`);
  }
}

main().finally(() => prisma.$disconnect());
