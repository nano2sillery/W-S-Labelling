import { supabase } from './client';

const BUCKET_NAME = 'regulatory-mentions';
const SVG_FOLDER = 'svg';

export async function uploadSvgFile(file: File, path: string) {
  const fullPath = `${SVG_FOLDER}/${path}`;
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fullPath, file, {
      contentType: 'image/svg+xml',
      upsert: true
    });

  if (error) throw error;
  return fullPath;
}

export async function getSvgUrl(path: string): Promise<string | null> {
  if (!path) return null;
  
  try {
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);

    return data.publicUrl;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'URL:', error);
    return null;
  }
}