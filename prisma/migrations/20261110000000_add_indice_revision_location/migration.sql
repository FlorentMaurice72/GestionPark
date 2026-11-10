-- Add indice_revision to locations table
-- "IRL" = Indice de Référence des Loyers (logements)
-- "ICC" = Indice du Coût de la Construction (boxes/commercial) — default
-- "fixe" = pas de révision indexée
ALTER TABLE "locations" ADD COLUMN "indice_revision" TEXT NOT NULL DEFAULT 'ICC';
