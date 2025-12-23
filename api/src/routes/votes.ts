import { Router } from 'express';
import { createVote, getVotesByProposal, getUserVote, getVoteCounts } from '../db/models/vote';
import { syncVoteToGitHub } from '../services/github';
import { authenticate, AuthRequest } from '../middleware/auth';

export const votesRouter = Router();

// POST /api/v1/votes - Create or update a vote
votesRouter.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { proposal_id, vote_type } = req.body;
    const user_id = req.user?.userId;
    
    if (!proposal_id || !user_id || !vote_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (vote_type !== 'upvote' && vote_type !== 'downvote') {
      return res.status(400).json({ error: 'Invalid vote_type' });
    }
    
    // Create vote in database
    const vote = await createVote({
      proposal_id,
      user_id,
      vote_type,
    });
    
    // Sync to GitHub (add reaction to PR)
    try {
      await syncVoteToGitHub(proposal_id, vote_type);
    } catch (error) {
      console.error('Error syncing vote to GitHub:', error);
      // Vote is still saved, but GitHub sync failed
    }
    
    res.status(201).json(vote);
  } catch (error) {
    console.error('Error creating vote:', error);
    res.status(500).json({ error: 'Failed to create vote' });
  }
});

// GET /api/v1/votes/proposal/:proposal_id - Get votes for a proposal
votesRouter.get('/proposal/:proposal_id', async (req, res) => {
  try {
    const { proposal_id } = req.params;
    const votes = await getVotesByProposal(proposal_id);
    const counts = await getVoteCounts(proposal_id);
    
    res.json({
      votes,
      counts,
      approval_rate: counts.upvotes + counts.downvotes > 0
        ? (counts.upvotes / (counts.upvotes + counts.downvotes)) * 100
        : 0,
    });
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

// GET /api/v1/votes/proposal/:proposal_id/user/:user_id - Get user's vote
votesRouter.get('/proposal/:proposal_id/user/:user_id', async (req, res) => {
  try {
    const { proposal_id, user_id } = req.params;
    const vote = await getUserVote(proposal_id, user_id);
    res.json({ vote });
  } catch (error) {
    console.error('Error fetching user vote:', error);
    res.status(500).json({ error: 'Failed to fetch user vote' });
  }
});

