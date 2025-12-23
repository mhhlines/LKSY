import { query } from '../index';
import { User } from '../../../shared/types';

export async function createUser(data: {
  github_id: string;
  github_username: string;
  name?: string;
  avatar_url?: string;
  email?: string;
}): Promise<User> {
  const result = await query(
    `INSERT INTO users (github_id, github_username, name, avatar_url, email)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (github_id) DO UPDATE SET
       github_username = EXCLUDED.github_username,
       name = COALESCE(EXCLUDED.name, users.name),
       avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
       email = COALESCE(EXCLUDED.email, users.email),
       updated_at = NOW()
     RETURNING *`,
    [data.github_id, data.github_username, data.name, data.avatar_url, data.email]
  );
  return result.rows[0];
}

export async function getUserByGitHubId(github_id: string): Promise<User | null> {
  const result = await query('SELECT * FROM users WHERE github_id = $1', [github_id]);
  return result.rows[0] || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

