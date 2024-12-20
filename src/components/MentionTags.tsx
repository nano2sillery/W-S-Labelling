import React from 'react';
import { useMentionTags } from '../hooks/useMentionTags';
import { LoadingSpinner } from './LoadingSpinner';

interface MentionTagsProps {
  mentionId: string;
}

export function MentionTags({ mentionId }: MentionTagsProps) {
  const { tags, loading, error } = useMentionTags(mentionId);

  if (loading) {
    return <LoadingSpinner size="sm" />;
  }

  if (error || !tags.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map(tag => (
        <span
          key={tag.id}
          className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600"
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
}