import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  public readonly email: string;

  @MinLength(3)
  @MaxLength(50)
  public readonly username: string;

  @MinLength(8)
  public readonly password: string;
}

export class LoginDto {
  // @MinLength(3)
  // @MaxLength(50)
  public readonly username: string;

  // @MinLength(8)
  public readonly password: string;
}
