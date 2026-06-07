import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CouponController],
  providers: [CouponService],
})
export class CouponModule {}
