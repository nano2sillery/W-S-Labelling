/*
  # Correction des politiques de stockage

  1. Modifications
    - Suppression des anciennes politiques
    - Création de nouvelles politiques plus permissives pour les utilisateurs authentifiés
    - Ajout d'une politique pour l'accès aux fichiers publics
*/

-- Suppression des anciennes politiques
DROP POLICY IF EXISTS "Accès public en lecture pour les mentions réglementaires" ON storage.objects;
DROP POLICY IF EXISTS "Upload pour les utilisateurs authentifiés" ON storage.objects;
DROP POLICY IF EXISTS "Mise à jour pour les utilisateurs authentifiés" ON storage.objects;
DROP POLICY IF EXISTS "Suppression pour les utilisateurs authentifiés" ON storage.objects;

-- Nouvelle politique pour l'accès en lecture
CREATE POLICY "Lecture des fichiers pour utilisateurs authentifiés"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'regulatory-mentions');

-- Nouvelle politique pour l'upload
CREATE POLICY "Upload de fichiers pour utilisateurs authentifiés"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'regulatory-mentions'
  AND (storage.extension(name) = 'svg')
);

-- Nouvelle politique pour la mise à jour
CREATE POLICY "Mise à jour de fichiers pour utilisateurs authentifiés"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'regulatory-mentions');

-- Nouvelle politique pour la suppression
CREATE POLICY "Suppression de fichiers pour utilisateurs authentifiés"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'regulatory-mentions');

-- Mise à jour des permissions du bucket
UPDATE storage.buckets
SET public = false
WHERE id = 'regulatory-mentions';