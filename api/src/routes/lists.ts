import { Router } from 'express';
import { getListFromGitHub, getAllListsFromGitHub } from '../services/github';
import { getCachedList, cacheList, getAllCachedLists, incrementUsageCount } from '../db/models/list-cache';
import { recordView, recordDownload, recordApiCall } from '../db/models/list-usage';
import { List } from '../../shared/types';

export const listsRouter = Router();

// GET /api/v1/lists - Get all lists
listsRouter.get('/', async (req, res) => {
  try {
    const { tags, search } = req.query;
    
    // Try to get from cache, but don't fail if database is unavailable
    let lists: List[] = [];
    try {
      lists = await getAllCachedLists();
    } catch (cacheError) {
      console.warn('Cache unavailable, fetching from GitHub:', cacheError);
    }
    
    // If cache is empty, fetch from GitHub
    if (lists.length === 0) {
      try {
        lists = await getAllListsFromGitHub();
        // Cache all lists (only if we have a database connection)
        if (lists.length > 0) {
          try {
            for (const list of lists) {
              await cacheList(list);
            }
          } catch (dbError) {
            console.warn('Database caching failed, continuing without cache:', dbError);
          }
        }
      } catch (error) {
        console.error('Error fetching lists from GitHub:', error);
        return res.status(500).json({ error: 'Failed to fetch lists', details: error instanceof Error ? error.message : 'Unknown error' });
      }
    }
    
    // Filter by tags
    if (tags) {
      const tagArray = (tags as string).split(',');
      lists = lists.filter((list) =>
        tagArray.some((tag) => list.tags.includes(tag.trim()))
      );
    }
    
    // Search
    if (search) {
      const searchLower = (search as string).toLowerCase();
      lists = lists.filter(
        (list) =>
          list.name.toLowerCase().includes(searchLower) ||
          list.description.toLowerCase().includes(searchLower) ||
          list.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }
    
    res.json({
      lists: lists.map((list) => ({
        id: list.id,
        name: list.name,
        version: list.version,
        description: list.description,
        tags: list.tags,
        type: list.type,
        total_items: list.type === 'checks' && 'checks' in list ? list.checks.length : 0,
        last_updated: list.last_updated,
        url: `https://lksy.org/lists/${list.id}`,
      })),
      total: lists.length,
    });
  } catch (error) {
    console.error('Error fetching lists:', error);
    res.status(500).json({ error: 'Failed to fetch lists' });
  }
});

// GET /api/v1/lists/:id - Get specific list (latest version)
listsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await recordApiCall(id, 'latest');
    
    let list = await getCachedList(id);
    
    if (!list) {
      list = await getListFromGitHub(id);
      if (list) {
        await cacheList(list);
      }
    }
    
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    res.json(list);
  } catch (error) {
    console.error('Error fetching list:', error);
    res.status(500).json({ error: 'Failed to fetch list' });
  }
});

// GET /api/v1/lists/:id/v:version - Get specific version
listsRouter.get('/:id/v:version', async (req, res) => {
  try {
    const { id, version } = req.params;
    await recordApiCall(id, version);
    
    let list = await getCachedList(id, version);
    
    if (!list) {
      list = await getListFromGitHub(id, version);
      if (list) {
        await cacheList(list);
      }
    }
    
    if (!list) {
      return res.status(404).json({ error: 'List version not found' });
    }
    
    res.json(list);
  } catch (error) {
    console.error('Error fetching list version:', error);
    res.status(500).json({ error: 'Failed to fetch list version' });
  }
});

// GET /api/v1/lists/:id/versions - Get all versions
listsRouter.get('/:id/versions', async (req, res) => {
  try {
    const { id } = req.params;
    // This would fetch from GitHub tags
    // For now, return a placeholder
    res.json({
      list_id: id,
      versions: [],
    });
  } catch (error) {
    console.error('Error fetching versions:', error);
    res.status(500).json({ error: 'Failed to fetch versions' });
  }
});

// GET /api/v1/lists/:id/download?format=csv - Download as CSV
listsRouter.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    const { format } = req.query;
    
    if (format !== 'csv') {
      return res.status(400).json({ error: 'Only CSV format is supported' });
    }
    
    const list = await getCachedList(id) || await getListFromGitHub(id);
    
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    
    await recordDownload(id, list.version);
    
    // Generate CSV
    let csv = '';
    if (list.type === 'checks' && 'checks' in list) {
      csv = 'ID,Name,Severity,Description,Automatable,Detection Method\n';
      for (const check of list.checks) {
        csv += `"${check.id}","${check.name}","${check.severity}","${check.description}","${check.automatable ? 'yes' : 'no'}","${check.detection_method || ''}"\n`;
      }
    } else if (list.type === 'values' && 'values' in list) {
      // CSV generation for values would be more complex
      csv = 'Category,Value,Description\n';
      // Implementation would depend on values structure
    }
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${id}-v${list.version}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).json({ error: 'Failed to generate CSV' });
  }
});

