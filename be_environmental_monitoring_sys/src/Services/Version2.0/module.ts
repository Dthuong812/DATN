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
import { mergeIdIntoBody } from "../Version1.0/middleware/merge-id-into-body.middleware";
import { DepartmentController } from "./API/DepartmentController";
import { DepartmentRepository } from "./Infrastructure/Repository/DepartmentRepository";
import { DepartmentService } from "./Application/Services/DepartmentService";
import { DepartmentDao } from "./Infrastructure/Dao/DepartmentDao";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "15m" },
    }),
    ClientsModule.register([
      {
        name: 'Version2',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 6000,
        },
      },
    ])
  ],
  controllers: [ProjectController, 
    OrganizationController,
    DepartmentController

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
