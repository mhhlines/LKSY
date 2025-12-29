import { MetadataRoute } from 'next';
import { getLists } from '@/lib/github';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lists = await getLists();
  const baseUrl = 'https://lksy.org';

  const listEntries = lists.map((list) => ({
    url: `${baseUrl}/lists/${list.id}`,
    lastModified: list.last_updated ? new Date(list.last_updated) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/propose`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...listEntries,
  ];
}


