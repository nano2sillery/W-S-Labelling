import { useState, useEffect, useCallback } from 'react';
import { fetchMentions, createMention, updateMention, deleteMention, duplicateMention } from '../lib/services/mentions';
import type { Database } from '../lib/supabase-types';

type Mention = Database['public']['Tables']['regulatory_mentions']['Row'];
type MentionInsert = Database['public']['Tables']['regulatory_mentions']['Insert'];

export function useMentions() {
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadMentions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMentions();
      setMentions(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load mentions'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMentions();
  }, [loadMentions]);

  const handleOperation = async <T,>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T> => {
    try {
      const result = await operation();
      await loadMentions();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(errorMessage);
      setError(error);
      throw error;
    }
  };

  return {
    mentions,
    loading,
    error,
    refresh: loadMentions,
    createMention: (data: MentionInsert) => 
      handleOperation(() => createMention(data), 'Failed to create mention'),
    updateMention: (id: string, data: Partial<MentionInsert>) => 
      handleOperation(() => updateMention(id, data), 'Failed to update mention'),
    deleteMention: (id: string) => 
      handleOperation(() => deleteMention(id), 'Failed to delete mention'),
    duplicateMention: (mention: Mention) =>
      handleOperation(() => duplicateMention(mention), 'Failed to duplicate mention'),
  };
}