'use client';

import { useState } from 'react';

export function ProposeForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'checks' as 'checks' | 'values',
    tags: '',
    rationale: '',
    authorName: '',
    organization: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic would go here
    console.log('Submitting proposal:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">List Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  value="checks"
                  checked={formData.type === 'checks'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'checks' })}
                />
                <span className="ml-2">Checks/Validation</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="values"
                  checked={formData.type === 'values'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'values' })}
                />
                <span className="ml-2">Values/Standards</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              required
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="email, deliverability, spam"
            />
          </div>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Why is this list needed?</label>
            <textarea
              required
              value={formData.rationale}
              onChange={(e) => setFormData({ ...formData, rationale: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={4}
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
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Submit Proposal
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

