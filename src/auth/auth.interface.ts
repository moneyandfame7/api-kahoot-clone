import { User } from '@prisma/client';
export interface JwtPayload {
  sub: string;
  username: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  tokens: Tokens;
  user: User;
}
