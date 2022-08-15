import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  password: string;
}
