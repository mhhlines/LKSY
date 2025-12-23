import { Pool, Client } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create migrations table to track applied migrations
async function createMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

// Get list of applied migrations
async function getAppliedMigrations(): Promise<string[]> {
  const result = await pool.query('SELECT name FROM migrations ORDER BY name');
  return result.rows.map(row => row.name);
}

// Apply a migration
async function applyMigration(name: string, sql: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('INSERT INTO migrations (name) VALUES ($1)', [name]);
    await client.query('COMMIT');
    console.log(`✓ Applied migration: ${name}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`✗ Failed to apply migration ${name}:`, error);
    throw error;
  } finally {
    client.release();
  }
}

// Run migrations
export async function runMigrations() {
  try {
    await createMigrationsTable();
    const applied = await getAppliedMigrations();
    
    // Read schema.sql as the initial migration
    const schemaPath = join(__dirname, 'schema.sql');
    const schemaSQL = readFileSync(schemaPath, 'utf-8');
    
    const migrationName = '001_initial_schema';
    if (!applied.includes(migrationName)) {
      await applyMigration(migrationName, schemaSQL);
    }
    
    // Add more migrations here as needed
    // Future migrations would be in migrations/ directory
    
    console.log('All migrations applied successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  runMigrations();
}

