import { JwtGuard } from './../auth/guards/auth.guard';
import {
  Controller,
  Get,
  Body,
  Patch,
  Request,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  DefaultValuePipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../common/dto/update-user.dto';
import { User, ROLE } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Roles([ROLE.ADMIN])
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<User[]> {
    return await this.usersService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }
}
