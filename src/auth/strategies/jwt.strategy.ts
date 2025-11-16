import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) throw new Error('JWT SECRET IS REQUIRED');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findOne(payload.sub);
    if (!user) throw new UnauthorizedException();
    const { password, ...rest } = user;
    return rest;
  }
}
