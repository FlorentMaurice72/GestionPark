// Script de bootstrap : crée un compte admin en ligne de commande.
//
// Sert uniquement à amorcer le tout premier compte (impossible de passer par
// l'interface tant qu'aucun admin n'existe pour s'y connecter). Une fois un
// premier admin créé, les suivants doivent être créés depuis l'interface.
// Utilise la même fonction (createAdmin -> Prisma + bcrypt) que le fera
// l'interface plus tard : jamais d'INSERT SQL direct.
//
// Usage : npm run create-admin

// tsx (contrairement à Next.js) ne charge pas .env automatiquement — à faire
// explicitement, et avant les imports qui lisent process.env au chargement
// du module (ex: src/lib/prisma.ts instancie l'adapter pg dès l'import).
import "dotenv/config";

import readline from "node:readline";
import { createAdmin } from "../src/lib/admin";
import { prisma } from "../src/lib/prisma";

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

const ENTER_CHARS = new Set(["\n", "\r", ""]);
const BACKSPACE_CHARS = new Set(["", ""]);
const CTRL_C = "";

// Masque la saisie du mot de passe dans le terminal (les caractères tapés
// sont interceptés et ne sont jamais affichés).
function askPassword(question: string): Promise<string> {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    process.stdout.write(question);

    let password = "";
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    const onData = (char: string) => {
      if (ENTER_CHARS.has(char)) {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(password);
        return;
      }

      if (char === CTRL_C) {
        process.exit(1);
      }

      if (BACKSPACE_CHARS.has(char)) {
        password = password.slice(0, -1);
        return;
      }

      password += char;
    };

    stdin.on("data", onData);
  });
}

async function main() {
  console.log("Création du compte admin GestionPark\n");

  const email = await ask("Email : ");
  if (!email || !email.includes("@")) {
    console.error("Email invalide.");
    process.exit(1);
  }

  const existing = await prisma.admin.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (existing) {
    console.error(`Un admin existe déjà avec l'email ${email}.`);
    process.exit(1);
  }

  const password = await askPassword("Mot de passe (min. 8 caractères) : ");
  if (password.length < 8) {
    console.error("Le mot de passe doit contenir au moins 8 caractères.");
    process.exit(1);
  }

  const confirm = await askPassword("Confirmer le mot de passe : ");
  if (confirm !== password) {
    console.error("Les mots de passe ne correspondent pas.");
    process.exit(1);
  }

  const admin = await createAdmin(email, password);
  console.log(`\nAdmin créé : ${admin.email} (id ${admin.id})`);
}

main()
  .catch((error) => {
    console.error("Erreur lors de la création de l'admin :", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
