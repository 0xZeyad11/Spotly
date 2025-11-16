import {
  BadRequestException,
  UseGuards,
  Request,
  Body,
  Controller,
  Post,
  Get,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from 'src/users/dto/update-user.dto';
import { JwtGuard } from '../guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-new-account')
  async SignUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @Post('login')
  async Login(@Body() loginUser: LoginUserDto) {
    const { email, password } = loginUser;
    if (!email || !password) {
      throw new BadRequestException(
        'make sure to provide both email and password and try again!',
      );
    }
    return await this.authService.login(email, password);
  }
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@Request() req) {
    return req.user;
  }
}
