import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'generated/prisma';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createUserDto: CreateUserDto) {
    const existingUser: User | null =
      await this.databaseService.user.findUnique({
        where: { email: createUserDto.email },
      });

    if (existingUser) {
      return { status: 'fail', message: 'User with this email already exists' };
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    return {
      status: 'success',
      data: {
        user: await this.databaseService.user.create({
          data: {
            ...createUserDto,
            profile_image: '',
            password_reset_token: '',
            password_token_expiry: new Date(),
          },
        }),
      },
    };
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const users = await this.databaseService.user.findMany({
      skip,
      take: limit,
    });
    return { status: 'success', data: { users } };
  }

  async findOne(id: number) {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });
    console.log(user);
    if (!user) return { status: 'fail', message: 'User not found' };

    return { status: 'success', data: { user } };
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
}
