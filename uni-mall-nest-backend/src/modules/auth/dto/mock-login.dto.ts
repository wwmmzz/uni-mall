import { IsOptional, IsString, Matches } from 'class-validator';

export class MockLoginDto {
  @Matches(/^1\d{10}$/, { message: '请输入 11 位中国大陆手机号' })
  phone: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  nickname?: string;
}
