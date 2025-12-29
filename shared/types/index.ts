// Shared TypeScript types for lksy.org platform

export type ListType = 'checks' | 'values';
export type ListStatus = 'active' | 'proposed' | 'deprecated';
export type Severity = 'critical' | 'major' | 'minor' | 'recommended';
export type CheckStatus = 'approved' | 'proposed' | 'deprecated';
export type FalsePositiveRate = 'very_low' | 'low' | 'medium' | 'high';

export interface Check {
  id: string;
  name: string;
  severity: Severity;
  description: string;
  rationale?: string;
  automatable?: boolean;
  detection_method?: string;
  false_positive_rate?: FalsePositiveRate;
  votes?: {
    upvotes: number;
    downvotes: number;
  };
  status?: CheckStatus;
}

export interface ListMetadata {
  id: string;
  version: string;
  name: string;
  description: string;
  type: ListType;
  status?: ListStatus;
  maintainers?: string[];
  tags: string[];
  first_published?: string;
  last_updated?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface ChecksList extends ListMetadata {
  type: 'checks';
  checks: Check[];
}

export interface ValuesList extends ListMetadata {
  type: 'values';
  values: Record<string, any>;
}

export type List = ChecksList | ValuesList;

export interface Proposal {
  id: string;
  type: 'new-list' | 'modify-list';
  list_id: string;
  github_pr_number?: number;
  github_url?: string;
  title: string;
  description?: string;
  author_id?: string;
  author_name: string;
  status: 'pending' | 'approved' | 'merged' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Vote {
  id: string;
  proposal_id: string;
  user_id: string;
  vote_type: 'upvote' | 'downvote';
  created_at: string;
}

export interface User {
  id: string;
  github_id: string;
  github_username: string;
  name?: string;
  avatar_url?: string;
  email?: string;
  created_at: string;
}

export interface ListUsage {
  list_id: string;
  version: string;
  date: string;
  view_count: number;
  download_count: number;
  api_call_count: number;
}


