import React from 'react';
import { FileText, Image } from 'lucide-react';
import { MentionContent } from './MentionContent';
import { MentionActions } from './MentionActions';
import { MentionTags } from './MentionTags';
import { formatDate } from '../lib/utils/date';
import type { Database } from '../lib/supabase-types';

type Mention = Database['public']['Tables']['regulatory_mentions']['Row'];

interface MentionCardProps {
  mention: Mention;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function MentionCard({ mention, onEdit, onDelete, onDuplicate }: MentionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow transition-all duration-200 border border-gray-100">
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            {mention.content_type === 'text' ? (
              <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
            ) : (
              <Image className="w-4 h-4 text-green-500 flex-shrink-0" />
            )}
            <h3 className="font-medium text-gray-900 truncate">{mention.label}</h3>
          </div>
          <MentionActions
            mention={mention}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
          />
        </div>

        {/* Description - only if present */}
        {mention.description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{mention.description}</p>
        )}
        
        {/* Content */}
        <div className="mb-2">
          <MentionContent mention={mention} />
        </div>

        {/* Footer */}
        <div className="space-y-1.5">
          {/* Attributes */}
          {mention.attributes && Object.entries(mention.attributes as Record<string, string>).length > 0 && (
            <div className="flex flex-wrap gap-1">
              {Object.entries(mention.attributes as Record<string, string>).map(([key, value]) => (
                value && (
                  <span key={key} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-50 text-gray-600 border border-gray-100">
                    {key}: {value}
                  </span>
                )
              ))}
            </div>
          )}

          {/* Tags */}
          <MentionTags mentionId={mention.id} />

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-1.5 border-t border-gray-50">
            <span>{formatDate(mention.created_at)}</span>
            <span className="capitalize">{mention.content_type}</span>
          </div>
        </div>
      </div>
    </div>
  );
}