# GestionPark — Schéma de données réel (issu de l'audit boîte noire)

*Reconstitué à partir des réponses JSON capturées sur `momo-box-renter.vercel.app` le
18/07/2026. Fait foi sur le CDC théorique en cas d'écart — c'est le comportement réel
en production.*

---

## 1. Entités confirmées

### Bien
```
id                  int
nom                 string
type_bien           enum ("boxes", ...)
adresse_complete    string
nombre_boxes        int
taxe_fonciere       decimal
assurance           decimal
montant_emprunt     decimal
mensualite_emprunt  decimal
taux_emprunt        decimal
date_debut_emprunt  date
duree_emprunt       int (mois)
statut              enum ("actif", "archivé" probable)
archived_at         datetime | null
created_at          datetime
```
*Écart CDC : `archived_at` (et `statut` au niveau Bien) absents du CDC théorique —
c'est le mécanisme réel d'archivage d'un bien, confirmé fonctionnel.*

### Box
```
id           int
bien_id      FK -> Bien
numero       string  (ex: "1", "10B" — B majuscule en pratique)
superficie   decimal
statut       enum ("loué", "vacant" probable)
created_at   datetime
```
*Conforme au CDC. Pas de champ loyer, confirmé.*

### Locataire
```
id              int
nom             string
prenom          string
societe         string | null
association     string | null
email           string ("-" utilisé comme convention de vide, pas null)
telephone       string ("-" idem)
adresse         string ("-" idem)
ville           string
code_postal     string
statut          enum ("actif", "archivé")
date_archivage  datetime | null
created_at      datetime
```
*Conforme au CDC + `created_at`. **Anomalie de données récurrente** : `ville` et
`code_postal` sont fréquemment inversés en saisie réelle — à corriger à la migration,
pas un bug du logiciel. Le champ `association` n'est jamais utilisé en pratique même
pour de vraies associations (le nom est mis dans `nom`/`prenom`) — à trancher avec
Florent si on force son usage dans le nouveau formulaire.*

### Location
```
id                int
box_id            FK -> Box
locataire_id      FK -> Locataire
date_entree       date
loyer_actuel      decimal
depot_garantie    decimal
statut            enum ("actif", "terminé")
date_fin          date | null
created_at        datetime
matching_inputs   string[] | null   ⚠ absent du CDC
```
*Écart CDC majeur : `matching_inputs` est un tableau de libellés de référence
(ex : `"DROUIN NICOLAS"`, `"BOX E POIGNANT"`) configuré manuellement par location, et
utilisé pour le matching à l'import CSV. Le CDC décrit un matching automatique déduit
à la volée (nom/prénom/box) — la réalité est un **matching configuré et stocké**, plus
robuste mais nécessitant une UI d'édition dédiée par location.*

*Confirmé : pas de relation 1 locataire → N box actifs simultanément (règle du
29/01/2026 respectée dans les données réelles).*

*Anomalie relevée : `depot_garantie` négatif sur une location (`-1`) — erreur de
saisie à corriger en migration.*

### Paiement
```
id              int
location_id     FK -> Location
mois            int (1-12)
annee           int
montant         decimal
date_paiement   date
created_at      datetime
mode            string (ex: "virement")
```
*Écart CDC majeur, à double titre :*
1. *Pas de champ `etat_paiement` stocké en base — l'état (payé/impayé/partiel/trop-perçu)
   est recalculé à la volée en comparant la somme des paiements du mois au
   `loyer_actuel` de la Location. Aucune donnée à synchroniser, logique de calcul pure
   à réimplémenter côté API/frontend.*
2. *Pas de mécanique `paiement_source_id`/`est_affectation` pour les paiements
   multi-mois — invisible dans les données statiques. Plusieurs paiements distincts
   sur le même mois pour une même location existent (ex : location 34, mois 5/2026 :
   deux paiements de 80€ à des dates différentes), ce qui suggère une simple addition
   de lignes plutôt que le mécanisme source/affectation du CDC. **Non confirmé à 100%
   — à valider par un test réel** (cf. section 3).*
3. *Champ `mode` présent, alors que l'Avenant n°5 du CDC annonce son retrait
   (`mode_paiement` supprimé). Contradiction à trancher : garder `mode` dans le
   rebuild (recommandé, autant conserver l'info) ?*

---

## 2. Ce qui reste à capturer

| Entité / point | Pourquoi c'est utile |
|---|---|
| `documents` | Structure de la bibliothèque documentaire (baux, quittances, factures) |
| `admins` / `invites` / `login` / `admin-check` / `check-invite` | Comprendre le modèle d'authentification réel (comptes, invitations, sessions) — utile pour reproduire le flux "chaque admin crée son propre compte" du journal de décisions |
| `import-presets` | Structure exacte d'un preset banque (confirmé présent en prod, contenu non capturé) |
| Test multi-mois réel | Le point le plus important restant : provoquer un paiement multiple d'un locataire en retard et observer précisément ce qui se crée en base (nouvelle ligne simple, ou mécanisme plus complexe) |

---

## 3. Comment tester le cas multi-mois (quand tu as le temps)

1. Choisis un locataire de test (ou un vrai, avec précaution) qui a un mois impayé.
2. Simule un paiement du double du loyer mensuel (rattrapage de 2 mois).
3. Regarde si l'app propose une modal de répartition (comme décrit dans le CDC) ou si
   ça se contente de créer une ligne `Paiement` supplémentaire sur le mois en cours.
4. Dans Network, capture la requête POST/PUT déclenchée par cette action — c'est là
   que la vraie logique se révèle (payload envoyé, réponse reçue).
5. Regarde ensuite la réponse de `paiements` après l'action pour voir ce qui a été
   réellement créé en base.

---

*Ce document sert de référence directe pour écrire le `schema.prisma` du rebuild —
à donner tel quel à Claude Code en complément du CDC et du journal de décisions.*
