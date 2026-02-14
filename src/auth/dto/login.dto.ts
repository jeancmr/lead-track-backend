import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
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
}
