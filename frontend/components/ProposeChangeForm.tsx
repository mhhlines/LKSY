'use client';

import { useState } from 'react';
import { List } from '@/shared/types';

type ProposeChangeFormProps = {
  list: List;
};

export function ProposeChangeForm({ list }: ProposeChangeFormProps) {
  const [changeType, setChangeType] = useState<'add' | 'remove' | 'modify' | 'other'>('add');
  const [formData, setFormData] = useState({
    description: '',
    rationale: '',
    authorName: '',
    organization: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic would go here
    console.log('Submitting change proposal:', { list: list.id, changeType, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">What would you like to change?</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="add"
              checked={changeType === 'add'}
              onChange={(e) => setChangeType(e.target.value as any)}
              className="mr-2"
            />
            Add a new item (check or value)
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="remove"
              checked={changeType === 'remove'}
              onChange={(e) => setChangeType(e.target.value as any)}
              className="mr-2"
            />
            Remove an existing item
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="modify"
              checked={changeType === 'modify'}
              onChange={(e) => setChangeType(e.target.value as any)}
              className="mr-2"
            />
            Modify an existing item
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="other"
              checked={changeType === 'other'}
              onChange={(e) => setChangeType(e.target.value as any)}
              className="mr-2"
            />
            Other
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          rows={4}
          placeholder="Describe the change you're proposing..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Why is this important?</label>
        <textarea
          required
          value={formData.rationale}
          onChange={(e) => setFormData({ ...formData, rationale: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Your Name</label>
        <input
          type="text"
          required
          value={formData.authorName}
          onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Organization (optional)</label>
        <input
          type="text"
          value={formData.organization}
          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Submit Proposal
        </button>
      </div>
    </form>
  );
}


