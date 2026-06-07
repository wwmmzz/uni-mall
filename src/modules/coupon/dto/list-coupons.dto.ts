import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ListCouponsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  goodsAmount?: number;

  @IsOptional()
  @IsString()
  categoryId?: string;
}
