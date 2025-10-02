import { ProjectDto } from "../../Domain/Dto/project.dto";
import { ProjectEntity } from "../../Domain/Models/project.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class ProjectDao extends CoreDaoBase<ProjectEntity, ProjectDto> {
    constructor() {
      super(ProjectEntity);
    }
}