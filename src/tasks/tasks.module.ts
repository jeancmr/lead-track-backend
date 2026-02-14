import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { UsersModule } from 'src/users/users.module';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UsersModule, ClientsModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
