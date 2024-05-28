import { User } from '@prisma/client';
export interface JwtPayload {
  sub: string;
  username: string;
  // iat: number
  // exp: number
}

export interface RefreshJwtPayload extends JwtPayload {
  refreshToken: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface AuthResponse {
  tokens: Tokens;
  user: User;
}
