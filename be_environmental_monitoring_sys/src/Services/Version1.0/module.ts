import { Project } from './../../../../fe_environmental_monitoring_sys/src/types/types';
import { RoleFunctionPermissionRepository } from './Infrastructure/Repository/RoleFunctionPermissionRepository';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './Api/UserController';
import { UserService } from './Application/Services/UserService';
import { UserRepository } from './Infrastructure/Repository/UserRepository';
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
import { mergeIdIntoBody } from './middleware/merge-id-into-body.middleware';
import { LogsService } from './Application/Services/LogsService';
import { LogsRepository } from './Infrastructure/Repository/LogsRepository';
import { LogsDao } from './Infrastructure/Dao/LogsDao';
import { LogsController } from './Api/LogsController';
import { PermissionsService } from './Application/Services/PermissionsService';
import { PermissionsRepository } from './Infrastructure/Repository/PermissionsRepository';
import { PermissionsDao } from './Infrastructure/Dao/PermissionsDao';
import { PermissionsController } from './Api/PermissionsController';
import { FunctionsService } from './Application/Services/FunctionsService';
import { FunctionsRepository } from './Infrastructure/Repository/FunctionsRepository';
import { FunctionsDao } from './Infrastructure/Dao/FunctionsDao';
import { FunctionsController } from './Api/FunctionsController';
import { RoleFunctionPermissionDao } from './Infrastructure/Dao/RoleFunctionPermissionDao';
import { RolesDao } from './Infrastructure/Dao/RolesDao';
import { RolesRepository } from './Infrastructure/Repository/RoleRepository';
import { RolesService } from './Application/Services/RolesService';
import { RolesController } from './Api/RolesController';
import { UserRoleAssignmentsRepository } from './Infrastructure/Repository/UserRoleAssignmentsRepository';
import { UserRoleAssignmentsDao } from './Infrastructure/Dao/UserRoleAssignmentsDao';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis-yet';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProjectFunctionController } from './Api/ProjectFuntionsController';
import { ProjectFunctionsService } from './Application/Services/ProjectFunctionsService';
import { ProjectFunctionsRepository } from './Infrastructure/Repository/ProjectFunctionsRepository';
import { ProjectFunctionsDao } from './Infrastructure/Dao/ProjectFuntionsDao';
import { UserFunctionPermissionDao } from './Infrastructure/Dao/UserFunctionPermissionDao';
import { UserFunctionPermissionRepository } from './Infrastructure/Repository/UserFunctionPermissionRepository';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 1000 * 60 * 5,
    }),
    ClientsModule.register([
      {
        name: 'Version2',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 7000,
        },
      },
    ]),

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
    LogsController,
    PermissionsController,
    FunctionsController,
    RolesController,
    ProjectFunctionController,
  ],
  providers: [
    UserService,
    JwtService,
    UserRepository,
    UserDao,

    AuthService,
    CaptchaService,
    AccessStrategy,
    RefreshStrategy,
    MailService,
    TelegramService,


    LogsService,
    LogsRepository,
    LogsDao,

    PermissionsService,
    PermissionsRepository,
    PermissionsDao,

    FunctionsService,
    FunctionsRepository,
    FunctionsDao,

    RoleFunctionPermissionRepository,
    RoleFunctionPermissionDao,

    RolesDao,
    RolesRepository,
    RolesService,

    UserRoleAssignmentsRepository,
    UserRoleAssignmentsDao,

    ProjectFunctionsService,
    ProjectFunctionsRepository,
    ProjectFunctionsDao,
    UserFunctionPermissionRepository,
    UserFunctionPermissionDao,

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
