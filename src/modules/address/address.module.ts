import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
