/*
  # Correction des permissions de stockage

  1. Modifications
    - Ajout d'une politique pour l'accès public aux fichiers SVG
    - Mise à jour du bucket pour permettre l'accès public
*/

-- Mise à jour du bucket pour permettre l'accès public
UPDATE storage.buckets
SET public = true
WHERE id = 'regulatory-mentions';

-- Ajout d'une politique pour l'accès public aux fichiers SVG
CREATE POLICY "Accès public aux fichiers SVG"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'regulatory-mentions' 
  AND storage.extension(name) = 'svg'
);