import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';

import { AuthDto, LoginDto } from './auth.dto';
import { Tokens, JwtPayload, AuthResponse } from './auth.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async signup({ email, username, password }: AuthDto): Promise<AuthResponse> {
    const existedUser = await this.usersService.findByEmail(email);

    if (existedUser) {
      throw new BadRequestException('This email already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 3);
    // const verifyLink = crypto.randomUUID();

    const createdUser = await this.usersService.create({
      email,
      username,
      password: hashedPassword,
    });

    const tokens = await this.signTokens(createdUser);

    return { tokens, user: createdUser };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByUsername(dto.username);

    if (!user) {
      throw new BadRequestException('Username not found');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new BadRequestException('Incorrect password');
    }
    const tokens = await this.signTokens(user);

    return { tokens, user };
  }

  async signTokens(user: User): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '60m',
      secret: this.config.get<string>('JWT_ACCESS'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '60d',
      secret: this.config.get<string>('JWT_REFRESH'),
    });

    return { accessToken, refreshToken };
  }
}
