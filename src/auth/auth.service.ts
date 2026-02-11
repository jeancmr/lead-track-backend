import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  private readonly saltRounds = 12;

  async register(registerDto: RegisterDto) {
    const { email, password, ...userData } = registerDto;

    const userFound = await this.usersService.findOneByEmail(email);

    if (userFound) throw new BadRequestException('User already exists');

    const userSignedUp = await this.usersService.create({
      email,
      password: await bcrypt.hash(password, this.saltRounds),
      ...userData,
    });

    return { message: 'User signed up sucessfully', data: userSignedUp };
  }
}
