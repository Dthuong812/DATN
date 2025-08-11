import { LocationsRepository } from './Infrastructure/Repository/LocationsRepository';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { SensorTypesController } from './Api/SensorTypesController';
import { SensorTypesService } from './Application/Services/SensorTypesService';
import { SensorTypesRepository } from './Infrastructure/Repository/SensorTypesRepository';
import { SensorTypesDao } from './Infrastructure/Dao/SensorTypesDao';
import { SensorsController } from './Api/SensorsController';
import { SensorsService } from './Application/Services/SensorsService';
import { SensorsRepository } from './Infrastructure/Repository/SensorsRepository';
import { SensorsDao } from './Infrastructure/Dao/SensorsDao';
import { mergeIdIntoBody } from './middleware/merge-id-into-body.middleware';
import { DevicesController } from './Api/DevicesController';
import { DevicesRepository } from './Infrastructure/Repository/DevicesRepository';
import { DevicesService } from './Application/Services/DevicesService';
import { DevicesDao } from './Infrastructure/Dao/DevicesDao';
import { SensorsDataRepository } from './Infrastructure/Repository/SensorsDattaRepository';
import { SensorsDataDao } from './Infrastructure/Dao/SensorsDataDao';
import { LogsService } from './Application/Services/LogsService';
import { LogsRepository } from './Infrastructure/Repository/LogsRepository';
import { LogsDao } from './Infrastructure/Dao/LogsDao';
import { LogsController } from './Api/LogsController';

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
    LocationsController,
    SensorTypesController,
    SensorsController,
    DevicesController,
    LogsController,
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

    SensorTypesService,
    SensorTypesRepository,
    SensorTypesDao,

    SensorsService,
    SensorsRepository,
    SensorsDao,

    DevicesRepository,
    DevicesDao,
    DevicesService,

    SensorsDataRepository,
    SensorsDataDao,

    LogsService,
    LogsRepository,
    LogsDao,
    {
      provide: 'USER_REPOSITORY',
      useClass: UserRepsitory,
    },
    {
      provide: 'STATIONS_REPOSITORY',
      useClass: StationsRepository,
    },
    {
      provide: 'LOCATIONS_REPOSITORY',
      useClass: LocationsRepository,
    },

    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },

  ],
  
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(mergeIdIntoBody)
      .forRoutes(
        { path: '/:resource/:Id', method: RequestMethod.PATCH },
      );
  }
}
