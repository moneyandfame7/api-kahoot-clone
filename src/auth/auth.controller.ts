import { Body, Controller, Get, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto, EmailDto, LoginDto, ResetPasswordDto } from './auth.dto';
import { AuthResponse, RefreshJwtPayload } from './auth.interface';

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
    const user = req.user as RefreshJwtPayload | undefined;

    console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }

    // return this.service.signNewAccessToken(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/protected')
  async protected(@Req() req: Request) {
    return req.user;
  }

  @Post('/forgot')
  async forgot(@Body() dto: EmailDto) {
    return this.service.forgot(dto);
  }

  @Post('/reset')
  async reset(@Query('token') token: string, @Body() dto: ResetPasswordDto): Promise<AuthResponse> {
    return this.service.reset(dto, token);
  }
}
