import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly saltRounds = 12;

  async register(registerDto: RegisterDto) {
    const { password, ...userData } = registerDto;

    const userFound = await this.usersService.findOneByEmail(registerDto.email);

    if (userFound) throw new BadRequestException('User already exists');

    const userSignedUp = await this.usersService.create({
      ...registerDto,
      password: await bcrypt.hash(password, this.saltRounds),
    });

    const token = this.getJwtToken({
      id: userSignedUp.id,
      email: userSignedUp.email,
      role: userSignedUp.role,
    });

    return { message: 'User signed up sucessfully', data: userData, token };
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, createdAt, updatedAt, ...userData } = userFound;

    const token = await this.getJwtToken({
      id: userData.id,
      email,
      role: userData.role,
    });

    return { message: 'User logged sucessfully', data: userData, token };
  }

  async getJwtToken(payload: JwtPayload) {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}
