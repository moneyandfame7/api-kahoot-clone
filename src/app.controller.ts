import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './auth/auth.dto';

@Controller('')
export class AppController {
  @Post('/hello-world')
  async helloWorld(@Body() dto: LoginDto) {
    console.log('ITS FUCKING HELLO WORLD!');
    console.log({ dto });

    // throw new BadRequestException('HUI PIZDA HAHAHA');
    return {
      user: {
        id: '1',
        email: 'email',
        password: 'password',
        username: 'username',
      },
      tokens: {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      },
    };
  }
}
