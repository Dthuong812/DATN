import { ProjectOrganizationDto } from "../../Domain/Dto/project_organization.dto";
import { ProjectOrganizationEntity } from "../../Domain/Models/project_organization.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class ProjectOrganizationDao extends CoreDaoBase<ProjectOrganizationEntity, ProjectOrganizationDto> {
    constructor() {
      super(ProjectOrganizationEntity);
    }
}