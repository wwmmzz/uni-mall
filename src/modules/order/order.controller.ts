import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/types/auth-user';
import { CreateOrderDto } from './dto/create-order.dto';
import { ListOrdersDto } from './dto/list-orders.dto';
import { OrderService } from './order.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Query() query: ListOrdersDto) {
    return this.orderService.list(user, query);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateOrderDto) {
    return this.orderService.create(user, dto);
  }

  @Get(':orderNo')
  detail(@CurrentUser() user: AuthUser, @Param('orderNo') orderNo: string) {
    return this.orderService.detail(user, orderNo);
  }

  @Post(':orderNo/pay')
  pay(@CurrentUser() user: AuthUser, @Param('orderNo') orderNo: string) {
    return this.orderService.pay(user, orderNo);
  }

  @Post(':orderNo/cancel')
  cancel(@CurrentUser() user: AuthUser, @Param('orderNo') orderNo: string) {
    return this.orderService.cancel(user, orderNo);
  }

  @Post(':orderNo/finish')
  finish(@CurrentUser() user: AuthUser, @Param('orderNo') orderNo: string) {
    return this.orderService.finish(user, orderNo);
  }
}
