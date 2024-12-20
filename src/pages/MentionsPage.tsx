import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useMentions } from '../hooks/useMentions';
import { MentionsList } from '../components/MentionsList';
import { MentionDialog } from '../components/MentionDialog';
import { DeleteConfirmation } from '../components/DeleteConfirmation';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { Database } from '../lib/supabase-types';

type Mention = Database['public']['Tables']['regulatory_mentions']['Row'];
type MentionInsert = Database['public']['Tables']['regulatory_mentions']['Insert'];

export function MentionsPage() {
  const [selectedMention, setSelectedMention] = useState<Mention | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [mentionToDelete, setMentionToDelete] = useState<Mention | null>(null);

  const { mentions, loading, error, refresh, createMention, updateMention, deleteMention, duplicateMention } = useMentions();

  const handleOpenDialog = useCallback(() => {
    setSelectedMention(undefined);
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedMention(undefined);
  }, []);

  const handleEdit = useCallback((mention: Mention) => {
    setSelectedMention(mention);
    setIsDialogOpen(true);
  }, []);

  const handleDuplicate = useCallback(async (mention: Mention) => {
    try {
      await duplicateMention(mention);
    } catch (error) {
      console.error('Error duplicating mention:', error);
    }
  }, [duplicateMention]);

  const handleDeleteRequest = useCallback((mention: Mention) => {
    setMentionToDelete(mention);
    setIsDeleteConfirmOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!mentionToDelete) return;

    try {
      await deleteMention(mentionToDelete.id);
      setIsDeleteConfirmOpen(false);
      setMentionToDelete(null);
    } catch (error) {
      console.error('Error deleting mention:', error);
    }
  }, [mentionToDelete, deleteMention]);

  const handleCancelDelete = useCallback(() => {
    setIsDeleteConfirmOpen(false);
    setMentionToDelete(null);
  }, []);

  const handleSubmit = useCallback(async (mentionData: MentionInsert) => {
    try {
      if (selectedMention) {
        await updateMention(selectedMention.id, mentionData);
      } else {
        await createMention(mentionData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving mention:', error);
    }
  }, [selectedMention, createMention, updateMention, handleCloseDialog]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mentions Réglementaires</h1>
            <p className="mt-2 text-sm text-gray-600">
              Gérez vos mentions légales et réglementaires
            </p>
          </div>
          <button
            onClick={handleOpenDialog}
            className="inline-flex items-center px-4 py-2 border border-transparent 
                     rounded-lg shadow-sm text-sm font-medium text-white 
                     bg-blue-600 hover:bg-blue-700 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                     transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle Mention
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage error={error} onRetry={refresh} />
        ) : mentions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune mention</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par créer une nouvelle mention réglementaire
            </p>
          </div>
        ) : (
          <MentionsList
            mentions={mentions}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
            onDuplicate={handleDuplicate}
          />
        )}

        <MentionDialog
          isOpen={isDialogOpen}
          mention={selectedMention}
          onClose={handleCloseDialog}
          onSubmit={handleSubmit}
        />

        <DeleteConfirmation
          isOpen={isDeleteConfirmOpen}
          onConfirm={handleDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </div>
  );
}