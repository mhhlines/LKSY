import { Metadata } from 'next';
import { ProposeForm } from '@/components/ProposeForm';

export const metadata: Metadata = {
  title: 'Propose New List | lksy.org',
  description: 'Propose a new QA standards list to the community',
};

export default function ProposePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Propose a New List</h1>
      <ProposeForm />
    </div>
  );
}


