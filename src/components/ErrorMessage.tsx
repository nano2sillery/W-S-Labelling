import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { NetworkError, AuthenticationError } from '../lib/api/errors';

interface ErrorMessageProps {
  error: Error;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  let title = 'Une erreur est survenue';
  let message = 'Veuillez réessayer plus tard.';

  if (error instanceof NetworkError) {
    title = 'Erreur de connexion';
    message = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
  } else if (error instanceof AuthenticationError) {
    title = 'Session expirée';
    message = 'Veuillez vous reconnecter.';
  }

  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}