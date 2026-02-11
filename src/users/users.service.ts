import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}
  private readonly saltRounds = 12;

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this._userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, this.saltRounds),
      });

      await this._userRepository.save(user);

      return {
        user: userData,
      };
    } catch (error) {
      console.error('Error in UsersService = ', error);
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    return await this._userRepository.find();
  }

  findOne(id: number) {
    console.log(id, typeof id);
    return `This action returns a #${id} user`;
  }

  async findOneByEmail(email: string) {
    return await this._userRepository.findOneBy({ email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
