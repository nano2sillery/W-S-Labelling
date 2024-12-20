import { supabase } from '../supabase';
import { apiRequest } from '../api/client';
import type { Database } from '../supabase-types';

type Tag = Database['public']['Tables']['tags']['Row'];

export async function fetchMentionTags(mentionId: string): Promise<Tag[]> {
  return apiRequest(
    () => supabase
      .from('tags')
      .select(`
        *,
        mention_tags!inner(mention_id)
      `)
      .eq('mention_tags.mention_id', mentionId),
    { requireAuth: true }
  );
}