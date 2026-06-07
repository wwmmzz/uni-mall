import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/types/auth-user';
import { FavoriteService } from './favorite.service';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.favoriteService.list(user);
  }

  @Get(':productId')
  isFavorite(@CurrentUser() user: AuthUser, @Param('productId') productId: string) {
    return this.favoriteService.isFavorite(user, productId);
  }

  @Post('toggle')
  toggle(@CurrentUser() user: AuthUser, @Body() dto: ToggleFavoriteDto) {
    return this.favoriteService.toggle(user, dto);
  }
}
