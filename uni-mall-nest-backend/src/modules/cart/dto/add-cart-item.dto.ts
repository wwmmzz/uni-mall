import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class AddCartItemDto {
  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  skuName?: string = '默认规格';

  @IsInt()
  @Min(1)
  quantity: number = 1;
}
