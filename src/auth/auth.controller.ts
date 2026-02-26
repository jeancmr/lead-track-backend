import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import type { RequestWithUser } from './interfaces/jwt-payload.interface';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ description: 'User signed up sucessfully' })
  @ApiConflictResponse({ description: 'Email is already in used' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authservice.register(registerDto, res);
  }

  @Post('login')
  @ApiCreatedResponse({ description: 'User logged sucessfully' })
  @ApiUnauthorizedResponse({ description: 'Password incorrect' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authservice.login(loginDto, res);
  }

  @Post('logout')
  @ApiCreatedResponse({ description: 'Logged out successfully' })
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authservice.logout(res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verify(@Request() req: RequestWithUser) {
    return req.user;
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
