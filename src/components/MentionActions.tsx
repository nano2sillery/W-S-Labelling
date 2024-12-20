import React, { useState } from 'react';
import { MoreVertical, Pencil, Trash2, Copy } from 'lucide-react';
import type { Database } from '../lib/supabase-types';

type Mention = Database['public']['Tables']['regulatory_mentions']['Row'];

interface MentionActionsProps {
  mention: Mention;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function MentionActions({ mention, onEdit, onDelete, onDuplicate }: MentionActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1 rounded-full hover:bg-gray-100"
      >
        <MoreVertical className="h-5 w-5 text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onDuplicate();
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Copy className="mr-3 h-4 w-4" />
              Dupliquer
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onEdit();
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Pencil className="mr-3 h-4 w-4" />
              Modifier
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onDelete();
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <Trash2 className="mr-3 h-4 w-4" />
              Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  );
}