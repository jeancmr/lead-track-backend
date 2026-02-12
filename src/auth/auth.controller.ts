import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import type { RequestWithUser } from './interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authservice.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authservice.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req: RequestWithUser) {
    const object = {
      fromJwtStrategiy: req.user,
      message: 'wonderful',
    };
    return object;
  }
}
