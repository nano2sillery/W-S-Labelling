import React from 'react';
import { MentionCard } from './MentionCard';
import type { Database } from '../lib/supabase-types';

type Mention = Database['public']['Tables']['regulatory_mentions']['Row'];

interface MentionsListProps {
  mentions: Mention[];
  onEdit: (mention: Mention) => void;
  onDelete: (mention: Mention) => void;
  onDuplicate: (mention: Mention) => void;
}

export function MentionsList({ mentions, onEdit, onDelete, onDuplicate }: MentionsListProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {mentions.map((mention) => (
        <MentionCard
          key={mention.id}
          mention={mention}
          onEdit={() => onEdit(mention)}
          onDelete={() => onDelete(mention)}
          onDuplicate={() => onDuplicate(mention)}
        />
      ))}
    </div>
  );
}