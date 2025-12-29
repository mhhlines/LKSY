import { query } from '../index';
import { List } from '../../../shared/types';

export async function cacheList(list: List): Promise<void> {
  await query(
    `INSERT INTO list_cache (list_id, version, content, tags, updated_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (list_id, version) DO UPDATE SET
       content = EXCLUDED.content,
       tags = EXCLUDED.tags,
       updated_at = NOW()`,
    [list.id, list.version, JSON.stringify(list), list.tags]
  );
}

export async function getCachedList(list_id: string, version?: string): Promise<List | null> {
  const versionToUse = version || 'latest';
  let result;
  
  if (versionToUse === 'latest') {
    result = await query(
      'SELECT * FROM list_cache WHERE list_id = $1 ORDER BY version DESC LIMIT 1',
      [list_id]
    );
  } else {
    result = await query(
      'SELECT * FROM list_cache WHERE list_id = $1 AND version = $2',
      [list_id, version]
    );
  }
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return result.rows[0].content as List;
}

export async function incrementUsageCount(list_id: string, version: string): Promise<void> {
  await query(
    'UPDATE list_cache SET usage_count = usage_count + 1 WHERE list_id = $1 AND version = $2',
    [list_id, version]
  );
}

export async function getAllCachedLists(): Promise<List[]> {
  try {
    const result = await query(
      `SELECT DISTINCT ON (list_id) *
       FROM list_cache
       ORDER BY list_id, version DESC`
    );
    return result.rows.map(row => row.content as List);
  } catch (error) {
    console.warn('Database query failed, returning empty cache:', error);
    return [];
  }
}

