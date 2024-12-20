import React from 'react';
import { X } from 'lucide-react';
import type { Database } from '../lib/supabase-types';
import { MentionForm } from './MentionForm';

type Mention = Database['public']['Tables']['regulatory_mentions']['Row'];

interface MentionDialogProps {
  isOpen: boolean;
  mention?: Mention;
  onClose: () => void;
  onSubmit: (mention: Database['public']['Tables']['regulatory_mentions']['Insert'], tagIds: string[]) => Promise<void>;
}

export function MentionDialog({ isOpen, mention, onClose, onSubmit }: MentionDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>

          <h2 className="text-xl font-semibold mb-4">
            {mention ? 'Modifier la mention' : 'Nouvelle mention'}
          </h2>

          <MentionForm
            initialData={mention}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}