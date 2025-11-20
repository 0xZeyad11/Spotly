import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  profile_image?: string;
  user_name?: string | undefined;
}


export class LoginUserDto extends PartialType(CreateUserDto) {
  email: string;
  password: string;
}
