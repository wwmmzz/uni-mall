import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Controller('health')
export class HealthController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async check() {
    const db = await this.databaseService.one<{ ok: number; now: Date }>('SELECT 1 AS ok, NOW() AS now');
    return {
      status: 'ok',
      database: db.ok === 1 ? 'ok' : 'unknown',
      time: db.now,
    };
  }
}
