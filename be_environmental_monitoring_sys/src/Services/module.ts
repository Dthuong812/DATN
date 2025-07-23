import { User } from './../../../fe_environmental_monitoring_sys/src/types/types';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './Api/UserController';
import { UserService } from './Application/Services/UserService';
import { UserRepsitory } from './Infrastructure/Repository/UserRepository';
import { UserDao } from './Infrastructure/Dao/UserDao';
import { AuthController } from './Api/AuthController';
import { AuthService } from './Application/Services/AuthService';
import CaptchaService from './Application/Services/CaptchaService';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccessGuard } from 'src/common/guards';
import { AccessStrategy } from 'src/common/strategies/AccessStrategy';
import { RefreshStrategy } from 'src/common/strategies/RefreshStrategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [
    UserController,
    AuthController,
  ],
  providers: [
    UserService,
    JwtService,
    UserRepsitory,
    UserDao,

    AuthService,
    CaptchaService,
    AccessStrategy,
    RefreshStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
  ],
})
export class AppModule {}
