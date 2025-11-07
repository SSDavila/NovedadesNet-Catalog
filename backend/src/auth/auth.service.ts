import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/users.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { userName, userEmail, userPassword } = registerUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { userEmail },
    });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso.');
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const newUser = await this.prisma.user.create({
      data: {
        userName,
        userEmail,
        userPassword: hashedPassword,
      },
    });

    const { userPassword: _, ...userWithoutPassword } = newUser;
    return {
      message: 'Usuario creado exitosamente.',
      user: userWithoutPassword,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { userEmail, userPassword } = loginUserDto;
    const user = await this.prisma.user.findUnique({ where: { userEmail } });

    if (!user || !(await bcrypt.compare(userPassword, user.userPassword))) {
      throw new UnauthorizedException(
        'Correo o contraseña incorrectos. Intentalo denuevo',
      );
    }

    const payload = { email: user.userEmail, sub: user.userId };
    const { userPassword: __, ...userWithoutPassword } = user;
    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }
}