import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './auth.dto';
import { AuthResponse } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/signup')
  async signup(@Body() dto: AuthDto): Promise<AuthResponse> {
    return this.service.signup(dto);
  }

  @Post('/login')
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.service.login(dto);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('/refresh')
  async refresh(@Req() req: Request) {
    const user = req.user;
    console.log({ user });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/protected')
  async protected(@Req() req: Request) {
    return req.user;
  }

  @Post('/forgot')
  async forgot() {}
}
