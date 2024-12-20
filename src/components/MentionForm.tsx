import React, { useState, useEffect } from 'react';
import { uploadSvgFile } from '../lib/supabase-storage';
import { TagSelector } from './TagSelector';
import { useTags } from '../hooks/useTags';
import type { Database } from '../lib/supabase-types';

type MentionInsert = Database['public']['Tables']['regulatory_mentions']['Insert'];
type Mention = Database['public']['Tables']['regulatory_mentions']['Row'];

interface MentionFormProps {
  initialData?: Mention;
  onSubmit: (mention: MentionInsert, tagIds: string[]) => Promise<void>;
  onCancel: () => void;
}

export function MentionForm({ initialData, onSubmit, onCancel }: MentionFormProps) {
  const [formData, setFormData] = useState<Partial<MentionInsert>>({
    content_type: 'text',
    attributes: { size: '', position: '', color: '' },
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [svgFile, setSvgFile] = useState<File | null>(null);
  const { tags, categories, loading: loadingTags } = useTags();

  // Initialize form with existing data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        label: initialData.label,
        description: initialData.description,
        content_type: initialData.content_type,
        content: initialData.content,
        attributes: initialData.attributes,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.content_type) return;

    try {
      let updatedFormData = { ...formData };

      if (formData.content_type === 'svg' && svgFile) {
        const path = await uploadSvgFile(svgFile, `${Date.now()}-${svgFile.name}`);
        updatedFormData.content = path;
      }

      await onSubmit(updatedFormData as MentionInsert, selectedTags);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Libellé
            <input
              type="text"
              value={formData.label || ''}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type de contenu
            <select
              value={formData.content_type}
              onChange={(e) => {
                setFormData({ 
                  ...formData, 
                  content_type: e.target.value as 'text' | 'svg',
                  content: '' // Reset content when changing type
                });
                setSvgFile(null);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="text">Texte</option>
              <option value="svg">SVG</option>
            </select>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contenu
            {formData.content_type === 'text' ? (
              <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-blue-500 focus:ring-blue-500"
                rows={5}
              />
            ) : (
              <div className="space-y-2">
                <input
                  type="file"
                  accept=".svg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setSvgFile(file);
                  }}
                  className="mt-1 block w-full"
                />
                {formData.content && !svgFile && (
                  <p className="text-sm text-gray-500">
                    Fichier SVG actuel : {formData.content}
                  </p>
                )}
              </div>
            )}
          </label>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Attributs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="block text-sm font-medium text-gray-700">
              Taille
              <input
                type="text"
                value={(formData.attributes as any)?.size || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  attributes: { ...formData.attributes as any, size: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Position
              <input
                type="text"
                value={(formData.attributes as any)?.position || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  attributes: { ...formData.attributes as any, position: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Couleur
              <input
                type="text"
                value={(formData.attributes as any)?.color || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  attributes: { ...formData.attributes as any, color: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-blue-500 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {!loadingTags && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Tags</h3>
            <TagSelector
              tags={tags}
              categories={categories}
              selectedTags={selectedTags}
              onChange={setSelectedTags}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm 
                   font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm 
                   text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {initialData ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
}