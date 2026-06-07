import { IsBoolean, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @Matches(/^1\d{10}$/, { message: '请输入 11 位中国大陆手机号' })
  phone?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  detail?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
