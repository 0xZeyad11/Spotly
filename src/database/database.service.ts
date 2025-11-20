import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const gloabalOmitConfig = {
  user: {
    password: true,
    password_reset_token: true,
    password_token_expiry: true,
  },
};
@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      omit: gloabalOmitConfig,
    });
  }
  async onModuleInit(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.$connect();
  }
}
