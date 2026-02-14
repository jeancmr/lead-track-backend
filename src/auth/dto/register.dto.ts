import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'John Doe',
    description: 'User name',
  })
  @Transform(({ value }: { value: string }) => value.trim())
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'johndoe@mail.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'StrongRandomPassword',
    description: 'User password',
    minLength: 8,
  })
  @Transform(({ value }: { value: string }) => value.trim())
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'sales',
    description: 'user role',
    enum: ['admin', 'user', 'sales', 'support'],
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
