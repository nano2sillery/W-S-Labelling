/*
  # Schéma initial pour la gestion des mentions réglementaires

  1. Nouvelles Tables
    - `regulatory_mentions` : Stockage des mentions réglementaires
      - `id` : Identifiant unique
      - `label` : Libellé de la mention
      - `description` : Description détaillée
      - `content_type` : Type de contenu (text/svg)
      - `content` : Contenu texte ou URL du fichier SVG
      - `attributes` : Attributs JSON (taille, emplacement, couleur, etc.)
      - Timestamps de création/modification
    
    - `tag_categories` : Catégories de tags
      - `id` : Identifiant unique
      - `name` : Nom de la catégorie (pays, marque, qualité)
      - `description` : Description de la catégorie
    
    - `tags` : Tags pour la classification
      - `id` : Identifiant unique
      - `category_id` : Référence à la catégorie
      - `name` : Nom du tag
      - `description` : Description du tag
    
    - `mention_tags` : Association mentions-tags
      - `mention_id` : Référence à la mention
      - `tag_id` : Référence au tag

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques de lecture/écriture pour utilisateurs authentifiés
*/

-- Création des tables
CREATE TABLE regulatory_mentions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    label text NOT NULL,
    description text,
    content_type text NOT NULL CHECK (content_type IN ('text', 'svg')),
    content text,
    attributes jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users(id)
);

CREATE TABLE tag_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    description text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE tags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id uuid REFERENCES tag_categories(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now(),
    UNIQUE(category_id, name)
);

CREATE TABLE mention_tags (
    mention_id uuid REFERENCES regulatory_mentions(id) ON DELETE CASCADE,
    tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (mention_id, tag_id)
);

-- Activation RLS
ALTER TABLE regulatory_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tag_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE mention_tags ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Utilisateurs authentifiés peuvent lire les mentions"
    ON regulatory_mentions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Utilisateurs peuvent créer leurs propres mentions"
    ON regulatory_mentions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Utilisateurs peuvent modifier leurs mentions"
    ON regulatory_mentions FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by);

-- Politiques similaires pour les autres tables
CREATE POLICY "Lecture globale des catégories"
    ON tag_categories FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Lecture globale des tags"
    ON tags FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Lecture des associations mentions-tags"
    ON mention_tags FOR SELECT
    TO authenticated
    USING (true);

-- Insertion des catégories de base
INSERT INTO tag_categories (name, description) VALUES
    ('pays', 'Pays d''application'),
    ('marque', 'Marques concernées'),
    ('qualite', 'Qualités de produits');

-- Fonction de mise à jour du timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_regulatory_mentions_updated_at
    BEFORE UPDATE ON regulatory_mentions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();