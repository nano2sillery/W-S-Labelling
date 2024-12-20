/*
  # Création du bucket de stockage pour les mentions réglementaires

  1. Nouveau Bucket
    - Création du bucket 'regulatory-mentions' pour stocker les fichiers SVG
  2. Sécurité
    - Activation des politiques de sécurité pour le bucket
    - Ajout des politiques pour la lecture et l'écriture
*/

-- Création du bucket de stockage
INSERT INTO storage.buckets (id, name)
VALUES ('regulatory-mentions', 'regulatory-mentions')
ON CONFLICT DO NOTHING;

-- Politique pour permettre l'accès public en lecture
CREATE POLICY "Accès public en lecture pour les mentions réglementaires"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'regulatory-mentions');

-- Politique pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Upload pour les utilisateurs authentifiés"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'regulatory-mentions');

-- Politique pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Mise à jour pour les utilisateurs authentifiés"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'regulatory-mentions');