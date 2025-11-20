/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CreateUserDto } from '../../common/dto/create-user.dto';
import crypto from 'crypto';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { mailOptions } from 'src/common/types/mailOptions.type';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private salt: number;
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    // Loading the salt value from the env file for bcrypt
    const rawSalt = this.configService.get<string>('SALT') ?? '10';
    this.salt = parseInt(rawSalt) ?? 10;
  }

  async signUp(newuser: CreateUserDto): Promise<{ access_token: string }> {
    // 1. check user by email since there is no id created yet
    if (!newuser) {
      throw new BadRequestException(`Some data are missing`);
    }

    const userByEmail = await this.userService.findByEmail(newuser.email);
    if (userByEmail) {
      throw new BadRequestException('This account already exists');
    }
    const hashedPassword = await this.hashPassword(newuser.password);

    const userData = {
      ...newuser,
      password: hashedPassword,
    };

    const created_user = await this.userService.createUser(userData);
    const token = await this.signToken(created_user);
    return {
      access_token: token,
    };
  }

  async hashPassword(password: string): Promise<string> {
    console.log(password, this.salt);
    return await bcrypt.hash(password, this.salt ?? 10);
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    // search if the user exists by email
    const finduser = await this.userService.findByEmail(email);
    if (!finduser) {
      throw new UnauthorizedException(
        'there is no user with that email, make sure to sign up please',
      );
    }
    const is_correct_password = await this.comparePassword(
      password,
      finduser.password,
    );

    if (finduser.email !== email || !is_correct_password) {
      throw new UnauthorizedException(
        'Wrong email or password, please try again!',
      );
    }

    const login_token = await this.signToken(finduser);
    return {
      access_token: login_token,
    };
  }

  private async comparePassword(
    newPass: string,
    ogPassword: string,
  ): Promise<boolean> {
    if (!newPass || !ogPassword) {
      throw new BadRequestException(
        'Please provide your password to complete the login process',
      );
    }
    return await bcrypt.compare(newPass, ogPassword);
  }

  private async generateResetToken(userid: string): Promise<string> {
    const passwordResetToken = await crypto.randomBytes(32).toString('hex');
    const encryptedReset = await bcrypt.hash(passwordResetToken, 10);
    //save encrypted reset token in the db
    return passwordResetToken;
  }

  private async signToken(user: User): Promise<string> {
    if (!user) {
      throw new BadRequestException(
        'There is no provided user for generating an access token',
      );
    }

    return await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      user_name: user.user_name,
    });
  }
}
