import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { UsersService } from 'src/users/users.service';
import { PaginationDto } from 'src/common/guards/pagination.dto';
import { ClientStatus } from './enums/client-status.enum';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly _clientRepository: Repository<Client>,
    private readonly usersService: UsersService,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const ownerFound = await this.usersService.findOne(createClientDto.ownerId);

    const clientFound = await this.findOneByEmail(createClientDto.email);

    if (clientFound) throw new BadRequestException('Client already exists');

    const newClient = this._clientRepository.create({
      ...createClientDto,
      owner: ownerFound,
    });

    await this._clientRepository.save(newClient);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { owner, ...clientCreated } = newClient;

    return {
      message: 'Client registered succesfully',
      data: clientCreated,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 1, status, search } = paginationDto;

    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Client>[] = [];

    const baseFilters: FindOptionsWhere<Client> = {};

    if (status && status !== ClientStatus.ALL) {
      baseFilters.status = status;
    }

    if (search) {
      where.push(
        { ...baseFilters, name: ILike(`%${search}%`) },
        { ...baseFilters, email: ILike(`%${search}%`) },
        { ...baseFilters, company: ILike(`%${search}%`) },
      );
    } else {
      where.push(baseFilters);
    }

    const [clients, total] = await this._clientRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      clients,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllByOwner(ownerId: number) {
    if (isNaN(ownerId))
      throw new BadRequestException(`Id not valid. Id must be a number.`);

    return this._clientRepository.find({
      where: {
        owner: {
          id: ownerId,
        },
      },
    });
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
    const { ownerId, ...updateClientData } = updateClientDto;

    const clientFound = await this.findOne(id);

    let newOwner = {};

    if (ownerId) {
      newOwner = await this.usersService.findOne(ownerId);
    }

    await this._clientRepository.update(
      { id: clientFound.id },
      {
        ...updateClientData,
        owner: ownerId ? newOwner : clientFound.owner,
      },
    );

    const clientUpdated = await this.findOne(id);

    return {
      message: `Client with id ${id} updated succesfully`,
      data: clientUpdated,
    };
  }

  async remove(id: number) {
    const clientFound = await this.findOne(id);
    await this._clientRepository.delete(clientFound.id);

    return { message: 'Client deleted successfully' };
  }
}
