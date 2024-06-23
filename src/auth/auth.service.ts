import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';

import { AuthDto, EmailDto, LoginDto, ResetPasswordDto } from './auth.dto';
import { Tokens, JwtPayload, AuthResponse, RefreshJwtPayload, RefreshTokenResponse } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private jwtService: JwtService, private config: ConfigService, private mailService: MailService) {}
  async register({ email, username, password }: AuthDto): Promise<AuthResponse> {
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

    this.mailService.sendWelcome(createdUser).then(() => ({}));

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

  async forgot(dto: EmailDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('Email is invalid');
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };
    const tempToken = await this.jwtService.signAsync(payload, {
      expiresIn: '60m',
      secret: this.config.get('JWT_RESET'),
    });
    const link = `${this.config.get('CLIENT_URL')}/reset?token=${tempToken}`;

    this.mailService.sendResetLink(user, link);
  }

  async reset(dto: ResetPasswordDto, token: string) {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.config.get('JWT_RESET'),
    });

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new BadRequestException('Invalid user id');
    }
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords are not equals');
    }
    const isPasswordEqualToOld = await bcrypt.compare(dto.password, user.password);
    if (isPasswordEqualToOld) {
      throw new BadRequestException('Password is equal to old');
    }
    const hashed = await bcrypt.hash(dto.password, 3);
    const updatedUser = await this.usersService.update(user.id, {
      password: hashed,
    });

    return this.buildResponse(updatedUser);
  }

  async buildResponse(user: User): Promise<AuthResponse> {
    const tokens = await this.signTokens(user);

    return {
      tokens,
      user,
    };
  }

  async signTokens(user: User): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30s',
      secret: this.config.get<string>('JWT_ACCESS'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '60d',
      secret: this.config.get<string>('JWT_REFRESH'),
    });

    return { accessToken, refreshToken };
  }

  async signNewAccessToken(payload: JwtPayload): Promise<RefreshTokenResponse> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new BadRequestException('User Does Not Exist');
    }
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30s',
      secret: this.config.get<string>('JWT_ACCESS'),
    });

    return { accessToken };
  }
}
