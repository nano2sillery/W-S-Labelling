/*
  # Ajout des politiques de stockage manquantes
  
  1. Modifications
    - Ajout d'une politique pour la suppression des objets
    - Correction des politiques existantes pour une meilleure sécurité
*/

-- Politique pour permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Suppression pour les utilisateurs authentifiés"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'regulatory-mentions');

-- Mise à jour de la politique de lecture pour plus de sécurité
DROP POLICY IF EXISTS "Accès public en lecture pour les mentions réglementaires" ON storage.objects;
CREATE POLICY "Accès public en lecture pour les mentions réglementaires"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'regulatory-mentions');