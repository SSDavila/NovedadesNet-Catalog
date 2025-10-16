import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío.' })
  userEmail: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío.' })
  @MinLength(2, { message: 'El nombre de usuario debe tener al menos 2 caracteres.' })
  userName: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  userPassword: string;

  @IsOptional()
  @IsString()
  @IsIn(['VENDEDOR', 'ADMINISTRADOR', 'SUPER_ADMINISTRADOR'], { message: 'El rol del usuario no es válido.' })
  userRole?: string;
}