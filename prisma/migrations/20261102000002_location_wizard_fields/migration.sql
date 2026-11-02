-- Champs wizard location (Phase 9 — Brik-inspired)
ALTER TABLE locations
  ADD COLUMN IF NOT EXISTS renouvellement_auto BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS type_bail TEXT NOT NULL DEFAULT 'bail_box',
  ADD COLUMN IF NOT EXISTS terme_loyer_type TEXT NOT NULL DEFAULT 'a_echoir',
  ADD COLUMN IF NOT EXISTS moyen_paiement TEXT NOT NULL DEFAULT 'virement',
  ADD COLUMN IF NOT EXISTS relance_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS avis_loyer_auto BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS quittance_auto BOOLEAN NOT NULL DEFAULT true;
