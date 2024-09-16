import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from "./entities/user.entity";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'pipe',
      password: 'pipe',
      database: 'imageprocessing',
      entities: [Users],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Users]), 
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }