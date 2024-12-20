import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase-types';

type Tag = Database['public']['Tables']['tags']['Row'];
type TagCategory = Database['public']['Tables']['tag_categories']['Row'];

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadTags() {
      try {
        const [tagsResult, categoriesResult] = await Promise.all([
          supabase.from('tags').select('*'),
          supabase.from('tag_categories').select('*')
        ]);

        if (tagsResult.error) throw tagsResult.error;
        if (categoriesResult.error) throw categoriesResult.error;

        setTags(tagsResult.data);
        setCategories(categoriesResult.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load tags'));
      } finally {
        setLoading(false);
      }
    }

    loadTags();
  }, []);

  return { tags, categories, loading, error };
}