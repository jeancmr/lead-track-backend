import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ClientStatus } from 'src/clients/enums/client-status.enum';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsEnum(ClientStatus)
  @IsOptional()
  status?: ClientStatus;

  @IsString()
  @IsOptional()
  search?: string;
}
