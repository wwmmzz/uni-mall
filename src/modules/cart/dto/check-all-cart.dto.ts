import { IsBoolean } from 'class-validator';

export class CheckAllCartDto {
  @IsBoolean()
  checked: boolean;
}
