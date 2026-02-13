import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';
import { UsersService } from 'src/users/users.service';
import { ClientsService } from 'src/clients/clients.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly _noteRepository: Repository<Note>,
    private readonly usersService: UsersService,
    private readonly clientsService: ClientsService,
  ) {}

  async create(createNoteDto: CreateNoteDto) {
    await this.usersService.findOne(createNoteDto.user);
    await this.clientsService.findOne(createNoteDto.client);

    const newNote = this._noteRepository.create(createNoteDto);

    await this._noteRepository.save(newNote);
    return { message: 'Note saved succesfully', data: newNote };
  }

  findAll() {
    return this._noteRepository.find();
  }

  async findOne(id: string) {
    const noteFound = await this._noteRepository.findOneBy({ id });

    if (!noteFound) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    return noteFound;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    await this.findOne(id);

    await this._noteRepository.update({ id }, updateNoteDto);

    const noteUpdated = await this.findOne(id);

    return {
      message: `Note with id ${id} updated succesfully`,
      data: noteUpdated,
    };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this._noteRepository.delete(id);

    return { message: 'Note deleted successfully' };
  }
}
