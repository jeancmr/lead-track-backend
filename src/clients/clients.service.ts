import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly _clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const clientFound = await this.findOneByEmail(createClientDto.email);

    if (clientFound) throw new BadRequestException('Client already exists');

    const newClient = await this._clientRepository.save(createClientDto);

    return { message: 'Client registered succesfully', data: newClient };
  }

  async findAll() {
    return await this._clientRepository.find();
  }

  async findOne(id: number) {
    if (isNaN(id))
      throw new BadRequestException(`Id not valid. Id must be a number.`);

    const clientFound = await this._clientRepository.findOneBy({ id });

    if (!clientFound) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    return clientFound;
  }

  async findOneByEmail(email: string) {
    return await this._clientRepository.findOneBy({ email });
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const clientFound = await this.findOne(id);

    await this._clientRepository.update(
      { id: clientFound.id },
      updateClientDto,
    );

    const userUpdated = await this.findOne(id);

    return {
      message: `Client with id ${id} updated succesfully`,
      data: userUpdated,
    };
  }

  async remove(id: number) {
    const clientFound = await this.findOne(id);
    await this._clientRepository.delete(clientFound.id);

    return { message: 'Client deleted successfully' };
  }
}
