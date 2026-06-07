import 'dotenv/config';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Pool } from 'pg';

export function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required. Copy .env.example to .env first.');
  }

  return new Pool({
    connectionString,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });
}

export async function runSqlDirectory(directory: string) {
  const pool = createPool();
  const client = await pool.connect();

  try {
    const files = (await readdir(directory)).filter((file) => file.endsWith('.sql')).sort();
    await client.query('BEGIN');

    for (const file of files) {
      const sql = await readFile(join(directory, file), 'utf8');
      console.log(`Running ${file}`);
      await client.query(sql);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

export async function runSqlText(sql: string) {
  const pool = createPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}
