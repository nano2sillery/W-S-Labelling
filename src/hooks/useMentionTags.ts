import { useState, useEffect } from 'react';
import { fetchMentionTags } from '../lib/services/tags';
import type { Database } from '../lib/supabase-types';

type Tag = Database['public']['Tables']['tags']['Row'];

export function useMentionTags(mentionId: string) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadTags() {
      try {
        setLoading(true);
        const data = await fetchMentionTags(mentionId);
        setTags(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load tags'));
      } finally {
        setLoading(false);
      }
    }

    loadTags();
  }, [mentionId]);

  return { tags, loading, error };
}