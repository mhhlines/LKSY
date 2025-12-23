import { Octokit } from '@octokit/rest';
import { List } from '@/shared/types';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = process.env.GITHUB_OWNER || 'mhhlines';
const REPO = process.env.GITHUB_REPO || 'LKSY';

export async function getLists(): Promise<List[]> {
  try {
    const { data } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: 'community-standards/lists',
    });

    if (!Array.isArray(data)) {
      return [];
    }

    const listPromises = data
      .filter((item) => item.type === 'file' && item.name.endsWith('.json'))
      .map(async (file) => {
        try {
          const { data: fileData } = await octokit.repos.getContent({
            owner: OWNER,
            repo: REPO,
            path: file.path,
          });

          if ('content' in fileData && fileData.content) {
            const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
            return JSON.parse(content) as List;
          }
        } catch (error) {
          console.error(`Error fetching ${file.path}:`, error);
          return null;
        }
      });

    const lists = await Promise.all(listPromises);
    return lists.filter((list): list is List => list !== null);
  } catch (error) {
    console.error('Error fetching lists:', error);
    return [];
  }
}

export async function getList(id: string, version?: string): Promise<List | null> {
  try {
    const path = `community-standards/lists/${id}.json`;
    
    // If version is specified, try to get from that tag
    let ref: string | undefined;
    if (version && version !== 'latest') {
      ref = `${id}-v${version}`;
    }

    const { data } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path,
      ref,
    });

    if ('content' in data && data.content) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return JSON.parse(content) as List;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching list ${id}:`, error);
    return null;
  }
}

export async function getListVersions(id: string): Promise<string[]> {
  try {
    const { data: tags } = await octokit.repos.listTags({
      owner: OWNER,
      repo: REPO,
      per_page: 100,
    });

    const prefix = `${id}-v`;
    return tags
      .filter((tag) => tag.name.startsWith(prefix))
      .map((tag) => tag.name.replace(prefix, ''))
      .sort((a, b) => {
        // Sort by semantic version
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const aPart = aParts[i] || 0;
          const bPart = bParts[i] || 0;
          if (aPart !== bPart) {
            return bPart - aPart; // Descending order
          }
        }
        return 0;
      });
  } catch (error) {
    console.error(`Error fetching versions for ${id}:`, error);
    return [];
  }
}

