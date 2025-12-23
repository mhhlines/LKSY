import { Metadata } from 'next';
import { ProposeChangeForm } from '@/components/ProposeChangeForm';
import { getList } from '@/lib/github';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const list = await getList(params.id);
  return {
    title: `Suggest Change to ${list?.name || 'List'} | lksy.org`,
  };
}

export default async function ProposeChangePage({ params }: Props) {
  const list = await getList(params.id);
  
  if (!list) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Suggest a Change to {list.name}</h1>
      <ProposeChangeForm list={list} />
    </div>
  );
}

