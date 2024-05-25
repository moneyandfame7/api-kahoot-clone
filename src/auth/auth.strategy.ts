import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: '',
    });
  }

  public validate(payload: any): JwtPayload {
    console.log('validate', { payload });
    // const user = this.usersService.findById(payload.sub)
    return {
      sub: payload?.sub,
      username: payload?.username,
    };
  }
}
