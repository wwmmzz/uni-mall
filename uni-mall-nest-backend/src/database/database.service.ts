import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { SqlExecutor } from './sql-executor';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy, SqlExecutor {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly pool: Pool;

  constructor(private readonly configService: ConfigService) {
    const useSsl = this.configService.get<boolean>('DATABASE_SSL', false);

    this.pool = new Pool({
      connectionString: this.configService.getOrThrow<string>('DATABASE_URL'),
      ssl: useSsl ? { rejectUnauthorized: false } : undefined,
      max: 20,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }

  async onModuleInit() {
    const result = await this.query<{ now: Date }>('SELECT NOW() AS now');
    this.logger.log(`PostgreSQL connected at ${result.rows[0].now.toISOString()}`);
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  query<T extends QueryResultRow = any>(text: string, params: unknown[] = []): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }

  async one<T extends QueryResultRow = any>(text: string, params: unknown[] = []): Promise<T> {
    const result = await this.query<T>(text, params);
    if (!result.rows[0]) {
      throw new Error('Expected one row, but query returned no rows.');
    }
    return result.rows[0];
  }

  async oneOrNone<T extends QueryResultRow = any>(text: string, params: unknown[] = []): Promise<T | null> {
    const result = await this.query<T>(text, params);
    return result.rows[0] ?? null;
  }

  async withTransaction<T>(handler: (tx: SqlExecutor) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();

    const tx = this.createTransactionExecutor(client);

    try {
      await client.query('BEGIN');
      const result = await handler(tx);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private createTransactionExecutor(client: PoolClient): SqlExecutor {
    return {
      query: <T extends QueryResultRow = any>(text: string, params: unknown[] = []): Promise<QueryResult<T>> => client.query<T>(text, params),
      one: async <T extends QueryResultRow = any>(text: string, params: unknown[] = []): Promise<T> => {
        const result = await client.query<T>(text, params);
        if (!result.rows[0]) {
          throw new Error('Expected one row, but query returned no rows.');
        }
        return result.rows[0];
      },
      oneOrNone: async <T extends QueryResultRow = any>(text: string, params: unknown[] = []): Promise<T | null> => {
        const result = await client.query<T>(text, params);
        return result.rows[0] ?? null;
      },
    };
  }
}
