import { Octokit } from '@octokit/rest';
import { List } from '../../../shared/types';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = process.env.GITHUB_OWNER || 'lksy-org';
const REPO = process.env.GITHUB_REPO || 'community-standards';

export async function getListFromGitHub(id: string, version?: string): Promise<List | null> {
  try {
    const path = `lists/${id}.json`;
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
    console.error(`Error fetching list ${id} from GitHub:`, error);
    return null;
  }
}

export async function getAllListsFromGitHub(): Promise<List[]> {
  try {
    const { data } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: 'lists',
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
    console.error('Error fetching lists from GitHub:', error);
    return [];
  }
}

export async function createProposalPR(data: {
  type: 'new-list' | 'modify-list';
  list_id: string;
  title: string;
  description?: string;
  author_name: string;
  initial_data?: any;
}): Promise<any> {
  try {
    const branchName = `proposal/${data.type === 'new-list' ? 'new-list' : 'modify'}-${data.list_id}-${Date.now()}`;
    
    // Get main branch SHA
    const { data: mainBranch } = await octokit.repos.getBranch({
      owner: OWNER,
      repo: REPO,
      branch: 'main',
    });
    
    // Create branch
    await octokit.git.createRef({
      owner: OWNER,
      repo: REPO,
      ref: `refs/heads/${branchName}`,
      sha: mainBranch.commit.sha,
    });
    
    // Create or update file
    if (data.type === 'new-list') {
      const filePath = `lists/${data.list_id}.json`;
      const fileContent = JSON.stringify(data.initial_data, null, 2);
      
      await octokit.repos.createOrUpdateFileContents({
        owner: OWNER,
        repo: REPO,
        path: filePath,
        message: `[PROPOSAL] New list: ${data.title}`,
        content: Buffer.from(fileContent).toString('base64'),
        branch: branchName,
      });
    }
    
    // Create PR
    const pr = await octokit.pulls.create({
      owner: OWNER,
      repo: REPO,
      title: `[PROPOSAL] ${data.title}`,
      head: branchName,
      base: 'main',
      body: `## Proposal\n\n${data.description || ''}\n\n**Proposed by:** ${data.author_name}\n\n**Type:** ${data.type}`,
    });
    
    // Add labels
    await octokit.issues.addLabels({
      owner: OWNER,
      repo: REPO,
      issue_number: pr.data.number,
      labels: ['proposal', data.list_id],
    });
    
    return pr.data;
  } catch (error) {
    console.error('Error creating proposal PR:', error);
    throw error;
  }
}

export async function syncVoteToGitHub(proposal_id: string, vote_type: 'upvote' | 'downvote'): Promise<void> {
  try {
    // Get proposal to find PR number
    // This would require fetching from database
    // For now, this is a placeholder
    console.log(`Syncing vote ${vote_type} for proposal ${proposal_id} to GitHub`);
  } catch (error) {
    console.error('Error syncing vote to GitHub:', error);
    throw error;
  }
}

