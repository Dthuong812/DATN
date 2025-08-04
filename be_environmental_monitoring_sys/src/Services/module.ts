import { LocationsRepository } from './Infrastructure/Repository/LocationsRepository';
import { User, Station } from './../../../fe_environmental_monitoring_sys/src/types/types';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { MailService } from './Application/Services/MailService';
import { TelegramService } from './Application/Services/TelegramService';
import { MailerModule } from '@nestjs-modules/mailer';
import { StationsController } from './Api/StationsController';
import { StationsService } from './Application/Services/StationsService';
import { StationsRepository } from './Infrastructure/Repository/StationsRepository';
import { StationsDao } from './Infrastructure/Dao/StationsDao';
import { LocationsService } from './Application/Services/LocationService';
import { LocationsDao } from './Infrastructure/Dao/LocationsDao';
import { LocationsController } from './Api/LocationsController';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get("MAIL_HOST"),
          secure: true,
          port: 465,
          auth: {
            user: configService.get("MAIL_USER"),
            pass: configService.get("MAIL_PASS"),
          },
        },
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [
    UserController,
    AuthController,
    StationsController,
    LocationsController
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
    MailService,
    TelegramService,

    StationsService,
    StationsRepository, 
    StationsDao,

    LocationsService,
    LocationsDao,
    LocationsRepository,

    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
  ],
})
export class AppModule {}
