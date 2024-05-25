import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_REFRESH'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    console.log('Refresh:', { payload });
    // const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    // return { ...payload, refreshToken };

    return payload;
  }
}
