import { join } from 'node:path';
import { runSqlDirectory } from './sql-runner';

async function main() {
  await runSqlDirectory(join(process.cwd(), 'database', 'migrations'));
  console.log('Migrations completed.');
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
