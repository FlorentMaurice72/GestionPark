-- =============================================================
-- GestionPark — Données démo
-- Email : demo@gestionpark.fr  /  Mot de passe : Demo2026!
-- Exécuter dans Supabase SQL Editor APRÈS avoir créé le schéma.
-- =============================================================

DO $$
DECLARE
  v_admin_id    INT;
  v_bien_id     INT;
  v_box_ids     INT[] := '{}';
  v_loc_ids     INT[] := '{}';
  v_bid         INT;
  v_lid         INT;
  v_location_id INT;
  v_mois        INT  := EXTRACT(MONTH FROM CURRENT_DATE)::INT;
  v_annee       INT  := EXTRACT(YEAR  FROM CURRENT_DATE)::INT;
  i             INT;
BEGIN

  -- ── Admin ────────────────────────────────────────────────────
  SELECT id INTO v_admin_id FROM admins WHERE email = 'demo@gestionpark.fr';
  IF v_admin_id IS NULL THEN
    INSERT INTO admins (
      email, password_hash, nom_bailleur, adresse_bailleur,
      subscription_status, subscription_plan, created_at
    ) VALUES (
      'demo@gestionpark.fr',
      '$2b$12$CcPazOC7tnfL9KsWIqXpPOKtU40ROWOhPuWwxdKP744sEHLJrw9ie',
      'Groupe Stockage Premium',
      '12 Avenue de la République, 69001 Lyon',
      'active', 'pro',
      NOW() - INTERVAL '8 months'
    ) RETURNING id INTO v_admin_id;
  END IF;

  -- ── Bien ─────────────────────────────────────────────────────
  IF EXISTS (SELECT 1 FROM biens WHERE utilisateur_id = v_admin_id) THEN
    RAISE NOTICE 'Demo data already exists, skipping.';
    RETURN;
  END IF;

  INSERT INTO biens (
    nom, type_bien, adresse_complete,
    taxe_fonciere, assurance, mensualite_emprunt,
    valeur_estimee, statut, utilisateur_id
  ) VALUES (
    'Entrepôt Lyon Nord', 'entrepot',
    '45 rue Garibaldi, 69003 Lyon',
    1200.00, 350.00, 650.00, 280000.00, 'actif', v_admin_id
  ) RETURNING id INTO v_bien_id;

  -- ── Boxes (10 boxes : 8 loués, 2 disponibles) ────────────────
  FOR i IN 1..8 LOOP
    INSERT INTO boxes (numero, superficie, statut, bien_id)
    VALUES ('B' || LPAD(i::TEXT, 2, '0'), (8 + i * 1.5)::DECIMAL(10,2), 'loué', v_bien_id)
    RETURNING id INTO v_bid;
    v_box_ids := array_append(v_box_ids, v_bid);
  END LOOP;
  INSERT INTO boxes (numero, superficie, statut, bien_id) VALUES ('B09', 12.00, 'disponible', v_bien_id);
  INSERT INTO boxes (numero, superficie, statut, bien_id) VALUES ('B10', 18.00, 'disponible', v_bien_id);

  -- ── Locataires (8) ───────────────────────────────────────────
  FOR i IN 1..8 LOOP
    INSERT INTO locataires (nom, prenom, email, telephone, statut, utilisateur_id)
    VALUES (
      (ARRAY['Martin','Dupont','Bernard','Thomas','Petit','Robert','Simon','Laurent'])[i],
      (ARRAY['Paul','Marie','Luc','Emma','Julien','Sophie','Pierre','Clara'])[i],
      (ARRAY['paul.martin','marie.dupont','luc.bernard','emma.thomas',
             'julien.petit','sophie.robert','pierre.simon','clara.laurent'])[i] || '@example.com',
      '060' || LPAD(i::TEXT, 1, '0') || '34567' || i,
      'actif', v_admin_id
    ) RETURNING id INTO v_lid;
    v_loc_ids := array_append(v_loc_ids, v_lid);
  END LOOP;

  -- ── Locations (8 actives, 1 par box) ─────────────────────────
  FOR i IN 1..8 LOOP
    INSERT INTO locations (
      box_id, locataire_id, date_entree, loyer_actuel,
      depot_garantie, statut, date_revision_irl
    ) VALUES (
      v_box_ids[i],
      v_loc_ids[i],
      (NOW() - INTERVAL '1 year' - (i || ' months')::INTERVAL)::DATE,
      (120 + i * 15)::DECIMAL(10,2),
      (120 + i * 15)::DECIMAL(10,2),
      'actif',
      (CURRENT_DATE + INTERVAL '2 months' + (i || ' weeks')::INTERVAL)::DATE
    ) RETURNING id INTO v_location_id;

    -- Mois actuel : 6 sur 8 ont payé (2 impayés)
    IF i <= 6 THEN
      INSERT INTO paiements (location_id, mois, annee, montant, source)
      VALUES (v_location_id, v_mois, v_annee, (120 + i * 15)::DECIMAL(10,2), 'import_csv');
    END IF;

    -- Mois précédent : tous payés
    INSERT INTO paiements (location_id, mois, annee, montant, source)
    VALUES (
      v_location_id,
      CASE WHEN v_mois = 1 THEN 12 ELSE v_mois - 1 END,
      CASE WHEN v_mois = 1 THEN v_annee - 1 ELSE v_annee END,
      (120 + i * 15)::DECIMAL(10,2), 'import_csv'
    );

    -- Il y a 2 mois
    INSERT INTO paiements (location_id, mois, annee, montant, source)
    VALUES (
      v_location_id,
      CASE WHEN v_mois <= 2 THEN v_mois + 10 ELSE v_mois - 2 END,
      CASE WHEN v_mois <= 2 THEN v_annee - 1 ELSE v_annee END,
      (120 + i * 15)::DECIMAL(10,2), 'import_csv'
    );

    -- Il y a 3 mois
    INSERT INTO paiements (location_id, mois, annee, montant, source)
    VALUES (
      v_location_id,
      CASE WHEN v_mois <= 3 THEN v_mois + 9 ELSE v_mois - 3 END,
      CASE WHEN v_mois <= 3 THEN v_annee - 1 ELSE v_annee END,
      (120 + i * 15)::DECIMAL(10,2), 'import_csv'
    );

    -- Il y a 4 mois
    INSERT INTO paiements (location_id, mois, annee, montant, source)
    VALUES (
      v_location_id,
      CASE WHEN v_mois <= 4 THEN v_mois + 8 ELSE v_mois - 4 END,
      CASE WHEN v_mois <= 4 THEN v_annee - 1 ELSE v_annee END,
      (120 + i * 15)::DECIMAL(10,2), 'import_csv'
    );

    -- Il y a 5 mois
    INSERT INTO paiements (location_id, mois, annee, montant, source)
    VALUES (
      v_location_id,
      CASE WHEN v_mois <= 5 THEN v_mois + 7 ELSE v_mois - 5 END,
      CASE WHEN v_mois <= 5 THEN v_annee - 1 ELSE v_annee END,
      (120 + i * 15)::DECIMAL(10,2), 'import_csv'
    );

  END LOOP;

  RAISE NOTICE 'Demo data seeded successfully for admin_id=%', v_admin_id;
END $$;
