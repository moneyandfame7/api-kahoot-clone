import { Body, Controller, Get, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto, EmailDto, LoginDto, ResetPasswordDto } from './auth.dto';
import { AuthResponse, RefreshJwtPayload } from './auth.interface';
import { JwtAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/register')
  async register(@Body() dto: AuthDto): Promise<AuthResponse> {
    return this.service.register(dto);
  }

  @Post('/login')
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.service.login(dto);
  }

  @Get('/test')
  async test(): Promise<string> {
    return 'TEST';
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('/refresh')
  async refresh(@Req() req: Request) {
    const user = req.user as RefreshJwtPayload | undefined;

    console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.service.signNewAccessToken(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/protected')
  async protected(@Req() req: Request) {
    console.log('<<< PROTECTED ROUTE  >>>');
    console.log(req.user);

    return null;
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
