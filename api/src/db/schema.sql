-- LKSY Database Schema
-- PostgreSQL database for lksy.org platform

-- Users table (GitHub OAuth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id TEXT UNIQUE NOT NULL,
  github_username TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_github_id ON users(github_id);
CREATE INDEX idx_users_github_username ON users(github_username);

-- Proposals table (track website-created proposals)
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('new-list', 'modify-list')),
  list_id TEXT NOT NULL,
  github_pr_number INTEGER,
  github_url TEXT,
  title TEXT NOT NULL,
  description TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'merged', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_proposals_list_id ON proposals(list_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_github_pr ON proposals(github_pr_number);
CREATE INDEX idx_proposals_author ON proposals(author_id);

-- Votes table (prevent double-voting)
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(proposal_id, user_id)
);

CREATE INDEX idx_votes_proposal ON votes(proposal_id);
CREATE INDEX idx_votes_user ON votes(user_id);
CREATE INDEX idx_votes_type ON votes(vote_type);

-- List cache table (for fast API responses)
CREATE TABLE IF NOT EXISTS list_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id TEXT NOT NULL,
  version TEXT NOT NULL,
  content JSONB NOT NULL,
  tags TEXT[] NOT NULL,
  usage_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(list_id, version)
);

CREATE INDEX idx_list_cache_list_id ON list_cache(list_id);
CREATE INDEX idx_list_cache_tags ON list_cache USING GIN(tags);
CREATE INDEX idx_list_cache_updated ON list_cache(updated_at);

-- Usage analytics table
CREATE TABLE IF NOT EXISTS list_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id TEXT NOT NULL,
  version TEXT NOT NULL,
  date DATE NOT NULL,
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  api_call_count INTEGER DEFAULT 0,
  UNIQUE(list_id, version, date)
);

CREATE INDEX idx_list_usage_list_id ON list_usage(list_id);
CREATE INDEX idx_list_usage_date ON list_usage(date);
CREATE INDEX idx_list_usage_list_date ON list_usage(list_id, date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


