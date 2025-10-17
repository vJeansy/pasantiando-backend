import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(name: string): string {
    name = "Jeansy";
    if (name.length >= 2) {
      return `Made with ❤️ by, ${name}!`;
    } else {
      return 'Hello, World!'
    }
  }
}
