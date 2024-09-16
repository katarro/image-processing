import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth/auth.service';


@Controller('api')
export class AppController {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('register')
  async register(@Body() body: { username: string, password: string }) {
    const { username, password } = body;

    try {
      // Buscar si el usuario ya está registrado
      const user = await this.userRepository.findOne({
        where: { username },
      });

      if (user) {
        throw new HttpException('Usuario ya registrado', HttpStatus.CONFLICT);
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHashed = await bcrypt.hash(password, salt);

      // Registrar el nuevo usuario
      const newUser = this.userRepository.create({
        username,
        password: passwordHashed
      });

      await this.userRepository.save(newUser);

      return { message: 'Usuario registrado con éxito', status: HttpStatus.OK };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  async login(@Body() body: { username: string, password: string }) {
    const { username, password } = body;

    try {
      const user = await this.userRepository.findOne({
        where: { username },
      });

      if (!user) {
        throw new HttpException("Usuario no registrado", HttpStatus.CONFLICT)
      }

      const isPasswordMatching = await bcrypt.compare(password, user.password);

      if (!isPasswordMatching) {
        throw new HttpException("Contraseña incorrecta", HttpStatus.UNAUTHORIZED);
      }

      return this.authService.login(user);


    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
