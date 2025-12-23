import { notFound } from 'next/navigation';
import { getList, getListVersions } from '@/lib/github';
import { ListDetail } from '@/components/ListDetail';
import { Metadata } from 'next';
import { List } from '@/shared/types';

type Props = {
  params: {
    id: string;
  };
  searchParams: {
    version?: string;
  };
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const list = await getList(params.id, searchParams.version);
  if (!list) {
    return {
      title: 'List Not Found | lksy.org',
    };
  }

  const seo = list.seo || {};
  return {
    title: seo.title || `${list.name} v${list.version} | lksy.org`,
    description: seo.description || list.description,
    keywords: seo.keywords || list.tags,
    openGraph: {
      title: `${list.name} v${list.version}`,
      description: list.description,
      type: 'article',
      url: `https://lksy.org/lists/${list.id}`,
    },
  };
}

export default async function ListPage({ params, searchParams }: Props) {
  const list = await getList(params.id, searchParams.version);
  const versions = await getListVersions(params.id);

  if (!list) {
    notFound();
  }

  return <ListDetail list={list} versions={versions} />;
}

