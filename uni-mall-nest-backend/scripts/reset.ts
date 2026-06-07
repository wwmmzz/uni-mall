import { join } from 'node:path';
import { runSqlDirectory, runSqlText } from './sql-runner';

async function main() {
  await runSqlText(`
    DROP TABLE IF EXISTS payments CASCADE;
    DROP TABLE IF EXISTS order_items CASCADE;
    DROP TABLE IF EXISTS orders CASCADE;
    DROP TABLE IF EXISTS favorites CASCADE;
    DROP TABLE IF EXISTS cart_items CASCADE;
    DROP TABLE IF EXISTS carts CASCADE;
    DROP TABLE IF EXISTS user_coupons CASCADE;
    DROP TABLE IF EXISTS coupons CASCADE;
    DROP TABLE IF EXISTS user_addresses CASCADE;
    DROP TABLE IF EXISTS product_skus CASCADE;
    DROP TABLE IF EXISTS products CASCADE;
    DROP TABLE IF EXISTS categories CASCADE;
    DROP TABLE IF EXISTS banners CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    DROP FUNCTION IF EXISTS set_updated_at CASCADE;
  `);
  await runSqlDirectory(join(process.cwd(), 'database', 'migrations'));
  await runSqlDirectory(join(process.cwd(), 'database', 'seeds'));
  console.log('Database reset completed.');
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
