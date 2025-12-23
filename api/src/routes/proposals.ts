import { Router } from 'express';
import { createProposal, getProposalById, getProposalsByListId } from '../db/models/proposal';
import { createProposalPR } from '../services/github';
import { authenticate, AuthRequest } from '../middleware/auth';

export const proposalsRouter = Router();

// POST /api/v1/proposals - Create a new proposal
proposalsRouter.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { type, list_id, title, description, author_name, initial_data } = req.body;
    const author_id = req.user?.userId;
    
    if (!type || !list_id || !title || !author_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create proposal in database
    const proposal = await createProposal({
      type,
      list_id,
      title,
      description,
      author_name,
      author_id,
    });
    
    // Create GitHub PR
    try {
      const pr = await createProposalPR({
        type,
        list_id,
        title,
        description,
        author_name,
        initial_data,
      });
      
      // Update proposal with PR info
      // This would be done via updateProposalGitHubInfo
      
      res.status(201).json({
        ...proposal,
        github_url: pr.html_url,
        github_pr_number: pr.number,
      });
    } catch (error) {
      console.error('Error creating GitHub PR:', error);
      // Proposal is still created in DB, but PR creation failed
      res.status(201).json({
        ...proposal,
        error: 'Proposal created but GitHub PR creation failed',
      });
    }
  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ error: 'Failed to create proposal' });
  }
});

// GET /api/v1/proposals/:id - Get proposal by ID
proposalsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await getProposalById(id);
    
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    
    res.json(proposal);
  } catch (error) {
    console.error('Error fetching proposal:', error);
    res.status(500).json({ error: 'Failed to fetch proposal' });
  }
});

// GET /api/v1/proposals/list/:list_id - Get proposals for a list
proposalsRouter.get('/list/:list_id', async (req, res) => {
  try {
    const { list_id } = req.params;
    const proposals = await getProposalsByListId(list_id);
    res.json({ proposals });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

