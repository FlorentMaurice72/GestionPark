# GestionPark

Application de gestion locative pour des box de stockage (biens, boxes, locataires, loyers,
relances, finances). Next.js (App Router) + Prisma + PostgreSQL (Supabase) + Auth.js.

## Stack

- Next.js 16 (App Router, Server Actions)
- PostgreSQL via Supabase, Prisma 7 (`@prisma/adapter-pg`)
- Auth.js v5 (Credentials, session JWT)
- Resend (email de réinitialisation de mot de passe admin)
- Tailwind CSS

## Installation locale

```bash
npm install
cp .env.example .env   # puis renseigner les vraies valeurs (jamais commité)
npx prisma migrate deploy
npm run create-admin    # crée le premier compte admin (bootstrap uniquement)
npm run dev
```

Variables d'environnement (voir `.env.example`) :

- `DATABASE_URL` — pooler Supabase en transaction mode (port 6543), utilisé par l'app.
- `DIRECT_URL` — pooler Supabase en session mode (port 5432), utilisé par le CLI Prisma (migrations).
- `AUTH_SECRET` — secret Auth.js, généré avec `npx auth secret`.
- `RESEND_API_KEY` / `EMAIL_FROM` — compte Resend pour l'email de réinitialisation de mot de passe
  admin. Tant qu'aucun domaine n'est vérifié dans Resend, `EMAIL_FROM` doit rester
  `onboarding@resend.dev`, et l'envoi ne fonctionne que vers l'email du compte Resend lui-même.
  Sans clé configurée, le flux de reset de mot de passe échoue proprement avec un message
  d'erreur (pas de crash), mais ne fonctionne pas tant que la clé n'est pas renseignée.

## Migrations

```bash
npx prisma migrate deploy   # applique les migrations existantes (non interactif)
npx prisma generate         # régénère le client après un changement de schéma
```

`npx prisma migrate dev` ne fonctionne pas dans un terminal non interactif (agents, CI). Pour créer
une nouvelle migration dans ce contexte : générer le SQL avec
`npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script`,
créer un dossier `prisma/migrations/<timestamp>_<nom>/migration.sql` avec ce contenu, puis
`npx prisma migrate deploy`.

## Déploiement (Vercel)

Décision produit : un seul projet Supabase, partagé entre dev et prod (pas d'isolation de base de
données entre les deux environnements). À garder en tête : toute manipulation de données en local
(tests, scripts, resets) touche directement les données qui seraient utilisées en production.

1. Créer un dépôt distant (GitHub/GitLab) et y pousser le code, puis lier le projet sur Vercel.
2. Avant de rendre l'app accessible publiquement, régénérer le mot de passe de la base dans le
   dashboard Supabase (Settings > Database > Reset database password), puis mettre à jour
   `DATABASE_URL` et `DIRECT_URL` en local dans `.env` (toi-même, directement dans le fichier —
   pas besoin de me communiquer la valeur).
3. Dans Vercel, configurer les variables d'environnement de production :
   - `DATABASE_URL` / `DIRECT_URL` : mêmes valeurs (nouveau mot de passe) que dans `.env` local,
     un seul projet Supabase pour les deux environnements.
   - `AUTH_SECRET` : régénéré avec `npx auth secret` (valeur différente de celle du dev, même si
     la base est partagée — la session ne doit pas être partageable entre les deux déploiements).
   - `RESEND_API_KEY` / `EMAIL_FROM` : compte Resend (peut être le même compte qu'en dev, ou
     séparé).
4. Les migrations sont déjà appliquées (base partagée), rien à rejouer pour la prod.
5. Le compte admin existe déjà (base partagée) — inutile de relancer `create-admin` pour la prod.
6. Déployer. L'app tourne par défaut sur un sous-domaine `*.vercel.app`.

Après déploiement, vérifier en conditions réelles les seuils de performance du cahier des
charges (dashboard < 1s, import CSV 34 paiements < 3s) — les temps mesurés en local ne sont pas
représentatifs (latence réseau vers la base, cold starts serverless).

## Sauvegardes

Le plan Supabase gratuit **n'offre aucune sauvegarde automatique ni point-in-time recovery**
(ni même de sauvegarde manuelle depuis le dashboard — cette fonctionnalité est réservée aux plans
payants). Tant que le projet reste sur le plan gratuit, la seule protection est un export manuel
régulier, à la charge de l'admin.

### Export manuel (pg_dump)

Nécessite les outils client PostgreSQL (`pg_dump`) installés localement (macOS :
`brew install libpq` puis ajouter `$(brew --prefix libpq)/bin` au `PATH`, ou installer
Postgres.app).

```bash
# Utiliser DIRECT_URL (port 5432, connexion directe) — pg_dump ne fonctionne pas via le pooler
# en transaction mode (port 6543).
pg_dump "$DIRECT_URL" -F c -f "gestionpark_$(date +%Y%m%d).dump"
```

Pour restaurer :

```bash
pg_restore --clean --if-exists -d "$DIRECT_URL" "gestionpark_20260101.dump"
```

### Alternative : Supabase CLI (sans installer pg_dump)

```bash
npx supabase db dump --db-url "$DIRECT_URL" -f "gestionpark_$(date +%Y%m%d).sql"
```

Conserver les exports hors de la machine locale (ex. stockage cloud personnel), pas seulement
sur le disque qui a servi à l'export.

Si le volume de données réelles le justifie, réévaluer l'upgrade vers Supabase Pro (sauvegardes
quotidiennes automatiques sur 7 jours).

## Ce qui reste hors scope

- Stockage de fichiers réel (documents/baux) — actuellement métadonnées uniquement en base.
- Génération de bail à partir d'un modèle réel.
- Suppression automatique (droit à l'oubli après archivage) — actuellement manuelle uniquement
  (anonymisation RGPD depuis la fiche locataire archivé), pas de CRON.
