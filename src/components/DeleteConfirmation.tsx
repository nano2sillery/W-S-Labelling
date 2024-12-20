import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmation({ isOpen, onConfirm, onCancel }: DeleteConfirmationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onCancel} />
        
        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>

          <h3 className="mb-2 text-center text-lg font-medium">
            Confirmer la suppression
          </h3>
          <p className="mb-4 text-center text-sm text-gray-500">
            Êtes-vous sûr de vouloir supprimer cette mention ? Cette action est irréversible.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}