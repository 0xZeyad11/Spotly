import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getSpotlyWelcome(): string {
    return 'Welcome to the spotly platform';
  }
}
