import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { PaginationDto } from 'src/common/guards/pagination.dto';
import type { RequestWithUser } from 'src/auth/interfaces/jwt-payload.interface';
import { UserRole } from 'src/users/enums/user-role.enum';

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  async findAll(
    @Query() query: PaginationDto,
    @Request() req: RequestWithUser,
  ) {
    const { id, role } = req.user;

    const ownerId = role === UserRole.ADMIN ? undefined : id;

    return this.clientsService.findAll(query, ownerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @Get('owner/:ownerId')
  findAllByOwner(@Param('ownerId') ownerId: number) {
    return this.clientsService.findAllByOwner(ownerId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}
