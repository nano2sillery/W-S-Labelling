import React, { useEffect, useState } from 'react';
import { getSvgUrl } from '../lib/supabase/storage';
import { LoadingSpinner } from './LoadingSpinner';
import type { Database } from '../lib/supabase-types';

type Mention = Database['public']['Tables']['regulatory_mentions']['Row'];

interface MentionContentProps {
  mention: Mention;
}

export function MentionContent({ mention }: MentionContentProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    async function loadImage() {
      if (mention.content_type !== 'svg' || !mention.content) return;
      
      setLoading(true);
      setError(false);
      
      try {
        const url = await getSvgUrl(mention.content);
        if (mounted) {
          if (url) {
            setImageUrl(url);
            setError(false);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error('Erreur de chargement de l\'image:', err);
        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadImage();
    return () => { mounted = false; };
  }, [mention.content, mention.content_type]);

  if (mention.content_type === 'svg') {
    if (loading) {
      return <LoadingSpinner size="sm" />;
    }

    if (error || !imageUrl) {
      return (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
          Erreur de chargement
        </div>
      );
    }

    return (
      <img 
        src={imageUrl}
        alt={mention.label}
        className="w-12 h-12 object-contain"
        onError={() => setError(true)}
      />
    );
  }

  return (
    <p className="text-sm text-gray-600 line-clamp-2">
      {mention.content || mention.description || 'Aucun contenu'}
    </p>
  );
}