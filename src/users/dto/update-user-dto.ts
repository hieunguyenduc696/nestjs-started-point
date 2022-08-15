import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  @IsString()
  password: string;
}
