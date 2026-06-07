import { QueryResult, QueryResultRow } from 'pg';

export interface SqlExecutor {
  query<T extends QueryResultRow = any>(text: string, params?: unknown[]): Promise<QueryResult<T>>;
  one<T extends QueryResultRow = any>(text: string, params?: unknown[]): Promise<T>;
  oneOrNone<T extends QueryResultRow = any>(text: string, params?: unknown[]): Promise<T | null>;
}
