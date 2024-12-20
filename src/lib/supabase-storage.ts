import { supabase } from './supabase';

export async function uploadSvgFile(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('regulatory-mentions')
    .upload(`svg/${path}`, file, {
      contentType: 'image/svg+xml',
      upsert: true
    });

  if (error) throw error;
  return data.path;
}

export async function getSvgUrl(path: string) {
  const { data } = supabase.storage
    .from('regulatory-mentions')
    .getPublicUrl(`svg/${path}`);
  
  return data.publicUrl;
}