-- Ajout de la colonne subscription_plan sur admins
ALTER TABLE admins
  ADD COLUMN IF NOT EXISTS subscription_plan TEXT NOT NULL DEFAULT 'essentiel';
