-- =============================================================
-- GestionPark — Données de démonstration
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

  noms      TEXT[] := ARRAY['Martin','Dupont','Bernard','Thomas','Petit','Robert','Simon','Laurent'];
  prenoms   TEXT[] := ARRAY['Paul','Marie','Luc','Emma','Julien','Sophie','Pierre','Clara'];
  emails    TEXT[] := ARRAY[
    'paul.martin@example.com','marie.dupont@example.com','luc.bernard@example.com',
    'emma.thomas@example.com','julien.petit@example.com','sophie.robert@example.com',
    'pierre.simon@example.com','clara.laurent@example.com'
  ];
  loyers    DECIMAL[] := ARRAY[120,135,150,165,140,155,130,145];

  mois_m1   INT;  annee_m1  INT;
  mois_m2   INT;  annee_m2  INT;
  mois_m3   INT;  annee_m3  INT;
  mois_m4   INT;  annee_m4  INT;
  mois_m5   INT;  annee_m5  INT;

BEGIN

  -- Calcul des mois glissants
  mois_m1  := CASE WHEN v_mois  = 1 THEN 12 ELSE v_mois  - 1 END;
  annee_m1 := CASE WHEN v_mois  = 1 THEN v_annee - 1 ELSE v_annee END;
  mois_m2  := CASE WHEN mois_m1 = 1 THEN 12 ELSE mois_m1 - 1 END;
  annee_m2 := CASE WHEN mois_m1 = 1 THEN annee_m1 - 1 ELSE annee_m1 END;
  mois_m3  := CASE WHEN mois_m2 = 1 THEN 12 ELSE mois_m2 - 1 END;
  annee_m3 := CASE WHEN mois_m2 = 1 THEN annee_m2 - 1 ELSE annee_m2 END;
  mois_m4  := CASE WHEN mois_m3 = 1 THEN 12 ELSE mois_m3 - 1 END;
  annee_m4 := CASE WHEN mois_m3 = 1 THEN annee_m3 - 1 ELSE annee_m3 END;
  mois_m5  := CASE WHEN mois_m4 = 1 THEN 12 ELSE mois_m4 - 1 END;
  annee_m5 := CASE WHEN mois_m4 = 1 THEN annee_m4 - 1 ELSE annee_m4 END;

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

  -- Idempotent : ne pas re-seeder si déjà fait
  IF EXISTS (SELECT 1 FROM biens WHERE utilisateur_id = v_admin_id) THEN
    RAISE NOTICE 'Données démo déjà présentes, rien à faire.';
    RETURN;
  END IF;

  -- ── Bien ─────────────────────────────────────────────────────
  INSERT INTO biens (
    nom, type_bien, adresse_complete,
    taxe_fonciere, assurance, mensualite_emprunt,
    valeur_estimee, statut, utilisateur_id
  ) VALUES (
    'Entrepôt Lyon Nord', 'entrepot',
    '45 rue Garibaldi, 69003 Lyon',
    1200.00, 350.00, 650.00, 280000.00, 'actif', v_admin_id
  ) RETURNING id INTO v_bien_id;

  -- ── Boxes (10 : 8 loués, 2 disponibles) ──────────────────────
  FOR i IN 1..8 LOOP
    INSERT INTO boxes (numero, superficie, statut, bien_id)
    VALUES ('B' || LPAD(i::TEXT, 2, '0'), (8.0 + i * 1.5)::DECIMAL(10,2), 'loué', v_bien_id)
    RETURNING id INTO v_bid;
    v_box_ids := array_append(v_box_ids, v_bid);
  END LOOP;
  INSERT INTO boxes (numero, superficie, statut, bien_id) VALUES ('B09', 12.00, 'disponible', v_bien_id);
  INSERT INTO boxes (numero, superficie, statut, bien_id) VALUES ('B10', 18.00, 'disponible', v_bien_id);

  -- ── Locataires ───────────────────────────────────────────────
  FOR i IN 1..8 LOOP
    INSERT INTO locataires (nom, prenom, email, telephone, statut, utilisateur_id)
    VALUES (noms[i], prenoms[i], emails[i], '060' || i || '345678', 'actif', v_admin_id)
    RETURNING id INTO v_lid;
    v_loc_ids := array_append(v_loc_ids, v_lid);
  END LOOP;

  -- ── Locations + paiements ────────────────────────────────────
  FOR i IN 1..8 LOOP
    INSERT INTO locations (
      box_id, locataire_id, date_entree, loyer_actuel,
      depot_garantie, statut, date_revision_irl
    ) VALUES (
      v_box_ids[i],
      v_loc_ids[i],
      (NOW() - INTERVAL '1 year' - ((i || ' months')::INTERVAL))::DATE,
      loyers[i], loyers[i], 'actif',
      (CURRENT_DATE + INTERVAL '45 days' + ((i || ' weeks')::INTERVAL))::DATE
    ) RETURNING id INTO v_location_id;

    -- Mois en cours : 6/8 ont payé (impayés visibles)
    IF i <= 6 THEN
      INSERT INTO paiements (location_id, mois, annee, montant, source)
      VALUES (v_location_id, v_mois, v_annee, loyers[i], 'import_csv');
    END IF;

    -- Mois précédents : tous ont payé
    INSERT INTO paiements (location_id, mois, annee, montant, source) VALUES (v_location_id, mois_m1, annee_m1, loyers[i], 'import_csv');
    INSERT INTO paiements (location_id, mois, annee, montant, source) VALUES (v_location_id, mois_m2, annee_m2, loyers[i], 'import_csv');
    INSERT INTO paiements (location_id, mois, annee, montant, source) VALUES (v_location_id, mois_m3, annee_m3, loyers[i], 'import_csv');
    INSERT INTO paiements (location_id, mois, annee, montant, source) VALUES (v_location_id, mois_m4, annee_m4, loyers[i], 'import_csv');
    INSERT INTO paiements (location_id, mois, annee, montant, source) VALUES (v_location_id, mois_m5, annee_m5, loyers[i], 'import_csv');

  END LOOP;

  RAISE NOTICE 'Données démo créées avec succès (admin_id=%).',  v_admin_id;
END $$;
