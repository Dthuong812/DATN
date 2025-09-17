import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ProjectController } from "./API/ProjectContronller";
import { ProjectService } from "./Application/Services/ProjectService";
import { ProjectRepository } from "./Infrastructure/Repository/ProjectRepository";
import { ProjectDao } from "./Infrastructure/Dao/ProjectDao";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { OrganizationController } from "./API/OrganizationController";
import { OrganizationService } from "./Application/Services/OrganizationService";
import { OrganizationRepository } from "./Infrastructure/Repository/OrganizationRepository";
import { OrganizationDao } from "./Infrastructure/Dao/OrganizationDao";
import { ProjectOrganizationDao } from "./Infrastructure/Dao/ProjectOrganizationDao";
import { ProjectOrganizationRepository } from "./Infrastructure/Repository/ProjectOrganizationRepository";
import { APP_GUARD } from "@nestjs/core";
import { AccessGuard } from "src/common/guards";
import { JwtModule } from "@nestjs/jwt";
import { DepartmentController } from "./API/DepartmentController";
import { DepartmentRepository } from "./Infrastructure/Repository/DepartmentRepository";
import { DepartmentService } from "./Application/Services/DepartmentService";
import { DepartmentDao } from "./Infrastructure/Dao/DepartmentDao";
import { ObjectDao } from "./Infrastructure/Dao/ObjectDao";
import { ObjectService } from "./Application/Services/ObjectService";
import { ObjectRepository } from "./Infrastructure/Repository/ObjectRepository";
import { ObjectController } from "./API/ObjectController";
import { DeviceTypeController } from "./API/DeviceTypeController";
import { DeviceTypeService } from "./Application/Services/DeviceTypeService";
import { DeviceTypeRepository } from "./Infrastructure/Repository/DeviceTypeRepository";
import { DeviceTypeDao } from "./Infrastructure/Dao/DeviceTypeDao";
import { mergeIdIntoBody } from "./middleware/merge-id-into-body.middleware";
import { DeviceController } from "./API/DeviceController";
import { DeviceService } from "./Application/Services/DeviceService";
import { DeviceRepository } from "./Infrastructure/Repository/DeviceRepository";
import { DeviceDao } from "./Infrastructure/Dao/DeviceDao";
import { DeviceDataRepository } from "./Infrastructure/Repository/DeviceDataRepository";
import { DeviceDataDao } from "./Infrastructure/Dao/DeviceDataDao";
import { DeviceDataController } from "./API/DeviceDataController";
import { DeviceDataService } from "./Application/Services/DeviceDataService";
import { LocalRepository } from "./Infrastructure/Repository/LocalRepository";
import { LocalDao } from "./Infrastructure/Dao/LocalDao";
import { LocalService } from "./Application/Services/LocalService";
import { LocalController } from "./API/LocalController";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "15m" },
    }),
    ClientsModule.register([
      {
        name: 'app',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 6000,
        },
      },
    ]),
    
  ],
  controllers: [ProjectController, 
    OrganizationController,
    DepartmentController,
    ObjectController,
    DeviceTypeController,
    DeviceController,
    DeviceDataController,
    LocalController
  ],
  providers: [
    ProjectService,
    ProjectRepository,
    ProjectDao,

    OrganizationService,
    OrganizationRepository,
    OrganizationDao,

    ProjectOrganizationDao,
    ProjectOrganizationRepository,

    DepartmentRepository,
    DepartmentService,
    DepartmentDao,

    ObjectService,
    ObjectRepository,
    ObjectDao,

    DeviceTypeService,
    DeviceTypeRepository,
    DeviceTypeDao,

    DeviceService,
    DeviceRepository,
    DeviceDao,


    DeviceDataRepository,
    DeviceDataDao,
    DeviceDataService,
    LocalService,
    LocalRepository,
    LocalDao,
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
  ],
  exports: [],
})
export class Version2Module implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(mergeIdIntoBody)
      .forRoutes({ path: "/:resource/:Id", method: RequestMethod.PATCH });
  }
}
