import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { TaskStatus } from '../enum/task-status.enum';

export class CreateTaskDto {
  @Transform(({ value }: { value: string }) => value.trim())
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  title: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dueDate: Date;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  clientId: number;
}
