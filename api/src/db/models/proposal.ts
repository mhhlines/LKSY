import { query } from '../index';
import { Proposal } from '../../../shared/types';

export async function createProposal(data: {
  type: 'new-list' | 'modify-list';
  list_id: string;
  title: string;
  description?: string;
  author_id?: string;
  author_name: string;
  github_pr_number?: number;
  github_url?: string;
}): Promise<Proposal> {
  const result = await query(
    `INSERT INTO proposals (type, list_id, title, description, author_id, author_name, github_pr_number, github_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      data.type,
      data.list_id,
      data.title,
      data.description,
      data.author_id,
      data.author_name,
      data.github_pr_number,
      data.github_url,
    ]
  );
  return result.rows[0];
}

export async function getProposalById(id: string): Promise<Proposal | null> {
  const result = await query('SELECT * FROM proposals WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getProposalsByListId(list_id: string): Promise<Proposal[]> {
  const result = await query('SELECT * FROM proposals WHERE list_id = $1 ORDER BY created_at DESC', [list_id]);
  return result.rows;
}

export async function updateProposalStatus(
  id: string,
  status: 'pending' | 'approved' | 'merged' | 'rejected'
): Promise<Proposal> {
  const result = await query(
    'UPDATE proposals SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
}

export async function updateProposalGitHubInfo(
  id: string,
  github_pr_number: number,
  github_url: string
): Promise<Proposal> {
  const result = await query(
    'UPDATE proposals SET github_pr_number = $1, github_url = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
    [github_pr_number, github_url, id]
  );
  return result.rows[0];
}

