import { ConfigService } from '@nestjs/config';
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../common/dto/create-user.dto';
import { UpdateUserDto } from '../common/dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { User } from '@prisma/client';
import { mailOptions } from 'src/common/types/mailOptions.type';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: DatabaseService) {}
  async findAll(page: number, limit: number): Promise<User[]> {
    const skip = (page - 1) * limit;
    const users = await this.prisma.user.findMany({
      skip,
      take: limit,
    });
    return users;
  }

  async createUser(newUser: CreateUserDto): Promise<User> {
    if (!newUser) {
      throw new BadRequestException('user not found!');
    }
    return await this.prisma.user.create({ data: newUser });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new BadRequestException();

    return user;
  }

  // TODO use the updateuserdto in future
  async update(id: number, newUserName: UpdateUserDto): Promise<User | null> {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException();
    return await this.prisma.user.update({ where: { id }, data: newUserName });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return { status: 'fail', message: 'User not found' };
    await this.prisma.user.delete({
      where: { id },
    });
    return { status: 'success', data: null };
  }

  async findByEmail(email: string): Promise<any | null> {
    if (!email) throw new BadRequestException('email is required');
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    return user;
  }

}
