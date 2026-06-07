import { IsBoolean, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @MinLength(1)
  name: string;

  @Matches(/^1\d{10}$/, { message: '请输入 11 位中国大陆手机号' })
  phone: string;

  @IsString()
  province: string;

  @IsString()
  city: string;

  @IsString()
  district: string;

  @IsString()
  @MinLength(2)
  detail: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
