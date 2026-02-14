import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ClientsService } from 'src/clients/clients.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly _taskRepository: Repository<Task>,
    private readonly usersService: UsersService,
    private readonly clientsService: ClientsService,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const userFound = await this.usersService.findOne(createTaskDto.userId);
    const clientFound = await this.clientsService.findOne(
      createTaskDto.clientId,
    );

    const newTask = this._taskRepository.create({
      ...createTaskDto,
      assignedTo: userFound,
      client: clientFound,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { assignedTo, client, ...taskSaved } =
      await this._taskRepository.save(newTask);

    return { message: 'Note saved succesfully', data: taskSaved };
  }

  findAll() {
    return this._taskRepository.find();
  }

  async findOne(id: string) {
    const taskFound = await this._taskRepository.findOneBy({ id });

    if (!taskFound) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return taskFound;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const { userId, clientId, ...updateTaskData } = updateTaskDto;

    const taskFound = await this.findOne(id);

    let newUser = {};
    let newClient = {};

    if (userId) {
      newUser = await this.usersService.findOne(userId);
    }

    if (clientId) {
      newClient = await this.clientsService.findOne(clientId);
    }

    await this._taskRepository.update(
      { id: taskFound.id },
      {
        ...updateTaskData,
        assignedTo: userId ? newUser : taskFound.assignedTo,
        client: clientId ? newClient : taskFound.client,
      },
    );

    const taskUpdated = await this.findOne(id);

    return {
      message: `Task with id ${id} updated succesfully`,
      data: taskUpdated,
    };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this._taskRepository.delete(id);

    return { message: 'Note deleted successfully' };
  }
}
