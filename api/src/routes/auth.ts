import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, getUserByGitHubId } from '../db/models/user';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3002';

// GET /api/v1/auth/github - Initiate GitHub OAuth
authRouter.get('/github', (req, res) => {
  const state = Math.random().toString(36).substring(7);
  const redirectUri = `${FRONTEND_URL}/api/auth/callback`;
  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email&state=${state}`;
  
  // Store state in session or return to frontend
  res.json({ authUrl: githubAuthUrl, state });
});

// GET /api/v1/auth/callback - GitHub OAuth callback
authRouter.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code missing' });
    }
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      return res.status(400).json({ error: 'Failed to get access token' });
    }
    
    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    const githubUser = await userResponse.json();
    
    // Create or update user in database
    const user = await createUser({
      github_id: githubUser.id.toString(),
      github_username: githubUser.login,
      name: githubUser.name,
      avatar_url: githubUser.avatar_url,
      email: githubUser.email,
    });
    
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        githubId: user.github_id,
        githubUsername: user.github_username,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Redirect to frontend with token
    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// GET /api/v1/auth/me - Get current user
authRouter.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const user = await getUserByGitHubId(decoded.githubId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

