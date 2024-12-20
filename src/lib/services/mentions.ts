import { supabase } from '../supabase';
import { apiRequest } from '../api/client';
import type { Database } from '../supabase-types';

type Mention = Database['public']['Tables']['regulatory_mentions']['Row'];
type MentionInsert = Database['public']['Tables']['regulatory_mentions']['Insert'];

export async function fetchMentions(): Promise<Mention[]> {
  return apiRequest(
    () => supabase
      .from('regulatory_mentions')
      .select('*')
      .order('created_at', { ascending: false }),
    { requireAuth: true }
  );
}

export async function createMention(mentionData: Omit<MentionInsert, 'created_by'>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  return apiRequest(() =>
    supabase
      .from('regulatory_mentions')
      .insert([{
        ...mentionData,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single()
  );
}

export async function duplicateMention(mention: Mention) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Create a copy of the mention with a new name
  const duplicateData = {
    ...mention,
    label: `${mention.label} (copie)`,
    created_by: user.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Remove the id to create a new entry
  delete duplicateData.id;

  return apiRequest(() =>
    supabase
      .from('regulatory_mentions')
      .insert([duplicateData])
      .select()
      .single()
  );
}

export async function updateMention(id: string, mentionData: Partial<MentionInsert>) {
  return apiRequest(() =>
    supabase
      .from('regulatory_mentions')
      .update({
        ...mentionData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
  );
}

export async function deleteMention(id: string) {
  return apiRequest(() =>
    supabase
      .from('regulatory_mentions')
      .delete()
      .eq('id', id)
  );
}