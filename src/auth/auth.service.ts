import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const userFound = await this.usersService.findOneByEmail(email);

    if (!userFound) throw new NotFoundException('User does not exit');

    const isPasswordMatched = await bcrypt.compare(
      password,
      userFound.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Password incorrect');
    }

    // TODO: generate JWT

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...userData } = userFound;

    return { message: 'User logged sucessfully', data: userData };
  }
}
