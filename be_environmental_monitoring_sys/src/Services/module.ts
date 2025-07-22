import { User } from './../../../fe_environmental_monitoring_sys/src/types/types';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './Api/UserController';
import { UserService } from './Application/Services/UserService';
import { UserRepsitory } from './Infrastructure/Repository/UserRepository';
import { UserDao } from './Infrastructure/Dao/UserDao';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [
    UserController
  ],
  providers: [
    UserService,
    UserRepsitory,
    UserDao,

  ],
})
export class AppModule {}
