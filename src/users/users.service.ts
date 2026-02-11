import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this._userRepository.create(createUserDto);

      await this._userRepository.save(user);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userCreated } =
        await this._userRepository.save(user);

      return userCreated;
    } catch (error) {
      console.error('Error in UsersService = ', error);
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    return await this._userRepository.find();
  }

  async findOne(id: number) {
    if (isNaN(id))
      throw new BadRequestException(`Id not valid. Id must be a number.`);

    const userFound = await this._userRepository.findOneBy({ id });

    if (!userFound) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userFoundData } = userFound;

    return userFoundData;
  }

  async findOneByEmail(email: string) {
    return await this._userRepository.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userFound = await this.findOne(id);

    await this._userRepository.update({ id: userFound.id }, updateUserDto);

    const userUpdated = await this.findOne(id);

    return {
      message: `User with id ${id} updated succesfully`,
      data: userUpdated,
    };
  }

  async remove(id: number) {
    const userFound = await this.findOne(id);
    await this._userRepository.delete(userFound.id);

    return { message: 'User deleted successfully' };
  }
}
