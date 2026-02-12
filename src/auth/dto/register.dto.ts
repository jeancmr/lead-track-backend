import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/users/enums/user-role.enum';

export class RegisterDto {
  @Transform(({ value }: { value: string }) => value.trim())
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Transform(({ value }: { value: string }) => value.trim())
  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
