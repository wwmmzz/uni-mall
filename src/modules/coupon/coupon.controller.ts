import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/types/auth-user';
import { CouponService } from './coupon.service';
import { ListCouponsDto } from './dto/list-coupons.dto';

@Controller('coupons')
@UseGuards(JwtAuthGuard)
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Query() query: ListCouponsDto) {
    return this.couponService.list(user, query);
  }

  @Post(':id/claim')
  claim(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.couponService.claim(user, id);
  }
}
