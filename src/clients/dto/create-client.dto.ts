import { Transform } from 'class-transformer';
import {
  IsString,
  MinLength,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDate,
  IsPhoneNumber,
} from 'class-validator';
import { ClientStatus } from '../enums/client-status.enum';

export class CreateClientDto {
  @Transform(({ value }: { value: string }) => value.trim())
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber()
  @MinLength(2)
  @IsNotEmpty()
  phone: string;

  @Transform(({ value }: { value: string }) => value.trim())
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  company: string;

  @IsEnum(ClientStatus)
  @IsNotEmpty()
  status?: ClientStatus;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}
