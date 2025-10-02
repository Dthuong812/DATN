import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { ProjectOrganizationEntity } from "../../Domain/Models/project_organization.entity";
import { ProjectOrganizationDto } from "../../Domain/Dto/project_organization.dto";
import { ProjectOrganizationDao } from "../Dao/ProjectOrganizationDao";

@Injectable()
export class ProjectOrganizationRepository extends CoreRepositoryBase<ProjectOrganizationEntity, ProjectOrganizationDto> {
    constructor(
        private readonly ProjectOrganizationDao: ProjectOrganizationDao
    ) {
        super([ProjectOrganizationDao]);
    }
}