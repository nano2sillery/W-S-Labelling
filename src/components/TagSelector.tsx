import React from 'react';
import type { Database } from '../lib/supabase-types';

type Tag = Database['public']['Tables']['tags']['Row'];
type TagCategory = Database['public']['Tables']['tag_categories']['Row'];

interface TagSelectorProps {
  tags: Tag[];
  categories: TagCategory[];
  selectedTags: string[];
  onChange: (tagIds: string[]) => void;
}

export function TagSelector({ tags, categories, selectedTags, onChange }: TagSelectorProps) {
  const tagsByCategory = tags.reduce((acc, tag) => {
    const category = acc.get(tag.category_id) || [];
    category.push(tag);
    acc.set(tag.category_id, category);
    return acc;
  }, new Map<string, Tag[]>());

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.id} className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">{category.name}</h3>
          <div className="flex flex-wrap gap-2">
            {(tagsByCategory.get(category.id) || []).map((tag) => (
              <label
                key={tag.id}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm
                          bg-gray-100 hover:bg-gray-200 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600 mr-2"
                  checked={selectedTags.includes(tag.id)}
                  onChange={(e) => {
                    const newTags = e.target.checked
                      ? [...selectedTags, tag.id]
                      : selectedTags.filter(id => id !== tag.id);
                    onChange(newTags);
                  }}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}