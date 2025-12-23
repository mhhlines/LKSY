import { query } from '../index';
import { ListUsage } from '../../../shared/types';

export async function recordView(list_id: string, version: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  await query(
    `INSERT INTO list_usage (list_id, version, date, view_count)
     VALUES ($1, $2, $3, 1)
     ON CONFLICT (list_id, version, date) DO UPDATE SET
       view_count = list_usage.view_count + 1`,
    [list_id, version, today]
  );
}

export async function recordDownload(list_id: string, version: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  await query(
    `INSERT INTO list_usage (list_id, version, date, download_count)
     VALUES ($1, $2, $3, 1)
     ON CONFLICT (list_id, version, date) DO UPDATE SET
       download_count = list_usage.download_count + 1`,
    [list_id, version, today]
  );
}

export async function recordApiCall(list_id: string, version: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  await query(
    `INSERT INTO list_usage (list_id, version, date, api_call_count)
     VALUES ($1, $2, $3, 1)
     ON CONFLICT (list_id, version, date) DO UPDATE SET
       api_call_count = list_usage.api_call_count + 1`,
    [list_id, version, today]
  );
}

export async function getUsageStats(list_id: string, days: number = 30): Promise<ListUsage[]> {
  const result = await query(
    `SELECT * FROM list_usage
     WHERE list_id = $1
     AND date >= CURRENT_DATE - INTERVAL '${days} days'
     ORDER BY date DESC`,
    [list_id]
  );
  return result.rows;
}

