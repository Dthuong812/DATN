import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ProjectController } from "./API/ProjectContronller";
import { ProjectService } from "./Application/Services/ProjectService";
import { ProjectRepository } from "./Infrastructure/Repository/ProjectRepository";
import { ProjectDao } from "./Infrastructure/Dao/ProjectDao";
import { Or } from "typeorm";
import { OrganizationController } from "./API/OrganizationController";
import { OrganizationService } from "./Application/Services/OrganizationService";
import { OrganizationRepository } from "./Infrastructure/Repository/OrganizationRepository";
import { OrganizationDao } from "./Infrastructure/Dao/OrganizationDao";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })
    
  ],
  controllers: [
    ProjectController,
    OrganizationController
  ],
  providers: [
    ProjectService,
    ProjectRepository,
    ProjectDao,

    OrganizationService,
    OrganizationRepository,
    OrganizationDao
  ],
  exports: [],
})
export class Version2Module {}
