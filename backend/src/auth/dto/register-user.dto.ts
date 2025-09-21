import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsEmail()
  userEmail: string;

  @IsString()
  @MinLength(5, { message: 'La contraseña debe tener al menos 5 caracteres.' })
  userPassword: string;
}