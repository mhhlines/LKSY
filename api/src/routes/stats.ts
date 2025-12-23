import { Router } from 'express';
import { getAllCachedLists } from '../db/models/list-cache';
import { query } from '../db/index';

export const statsRouter = Router();

// GET /api/v1/stats - Get platform statistics
statsRouter.get('/', async (req, res) => {
  try {
    const lists = await getAllCachedLists();
    
    // Get contributor count
    const contributorsResult = await query('SELECT COUNT(DISTINCT author_id) as count FROM proposals WHERE author_id IS NOT NULL');
    const contributors = parseInt(contributorsResult.rows[0]?.count || '0');
    
    // Get total usage this month
    const usageResult = await query(
      `SELECT SUM(view_count + download_count + api_call_count) as total
       FROM list_usage
       WHERE date >= DATE_TRUNC('month', CURRENT_DATE)`
    );
    const totalUsage = parseInt(usageResult.rows[0]?.total || '0');
    
    // Get most popular lists
    const popularResult = await query(
      `SELECT list_id, SUM(view_count + download_count + api_call_count) as total
       FROM list_usage
       WHERE date >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY list_id
       ORDER BY total DESC
       LIMIT 10`
    );
    const mostPopular = popularResult.rows.map((row) => row.list_id);
    
    // Get recently updated
    const recentResult = await query(
      `SELECT list_id, MAX(updated_at) as updated_at
       FROM list_cache
       GROUP BY list_id
       ORDER BY updated_at DESC
       LIMIT 10`
    );
    const recentlyUpdated = recentResult.rows.map((row) => row.list_id);
    
    res.json({
      total_lists: lists.length,
      total_contributors: contributors,
      total_usage_this_month: totalUsage,
      most_popular: mostPopular,
      recently_updated: recentlyUpdated,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

