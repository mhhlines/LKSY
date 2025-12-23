import { query } from '../index';
import { Vote } from '../../../shared/types';

export async function createVote(data: {
  proposal_id: string;
  user_id: string;
  vote_type: 'upvote' | 'downvote';
}): Promise<Vote> {
  const result = await query(
    `INSERT INTO votes (proposal_id, user_id, vote_type)
     VALUES ($1, $2, $3)
     ON CONFLICT (proposal_id, user_id) DO UPDATE SET
       vote_type = EXCLUDED.vote_type,
       created_at = NOW()
     RETURNING *`,
    [data.proposal_id, data.user_id, data.vote_type]
  );
  return result.rows[0];
}

export async function getVotesByProposal(proposal_id: string): Promise<Vote[]> {
  const result = await query('SELECT * FROM votes WHERE proposal_id = $1', [proposal_id]);
  return result.rows;
}

export async function getUserVote(proposal_id: string, user_id: string): Promise<Vote | null> {
  const result = await query(
    'SELECT * FROM votes WHERE proposal_id = $1 AND user_id = $2',
    [proposal_id, user_id]
  );
  return result.rows[0] || null;
}

export async function getVoteCounts(proposal_id: string): Promise<{ upvotes: number; downvotes: number }> {
  const result = await query(
    `SELECT 
       COUNT(*) FILTER (WHERE vote_type = 'upvote') as upvotes,
       COUNT(*) FILTER (WHERE vote_type = 'downvote') as downvotes
     FROM votes
     WHERE proposal_id = $1`,
    [proposal_id]
  );
  return {
    upvotes: parseInt(result.rows[0].upvotes) || 0,
    downvotes: parseInt(result.rows[0].downvotes) || 0,
  };
}

