/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}
  async findAll(page: number, limit: number): Promise<User[]> {
    const skip = (page - 1) * limit;
    const users = await this.databaseService.user.findMany({
      skip,
      take: limit,
    });
    return users;
  }

  async createUser(newUser: CreateUserDto): Promise<User> {
    if (!newUser) {
      throw new BadRequestException('user not found!');
    }
    return await this.databaseService.user.create({ data: newUser });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });

    if (!user) throw new BadRequestException();

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });
    if (!user) return { status: 'fail', message: 'User not found' };
    const data: any = { ...updateUserDto };

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    // Check for email uniqueness
    if (data.email) {
      const existingUser = await this.databaseService.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser && existingUser.id !== id) {
        return {
          status: 'fail',
          message: 'Email is already in use by another account',
        };
      }
    }
    return {
      status: 'success',
      data: {
        user: await this.databaseService.user.update({
          where: { id },
          data,
        }),
      },
    };
  }

  async remove(id: number) {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });
    if (!user) return { status: 'fail', message: 'User not found' };
    await this.databaseService.user.delete({
      where: { id },
    });
    return { status: 'success', data: null };
  }

  async findByEmail(email: string): Promise<any | null> {
    if (!email) throw new BadRequestException('email is required');
    const user = await this.databaseService.user.findFirst({
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
