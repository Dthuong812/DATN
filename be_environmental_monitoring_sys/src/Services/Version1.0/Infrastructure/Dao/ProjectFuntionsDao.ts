import { ProjectFunctionsDto } from "../../Domain/Dtos/project_functions.dto";
import { ProjectFunctionsEntity } from "../../Domain/Models/project-functions.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class ProjectFunctionsDao extends CoreDaoBase<ProjectFunctionsEntity, ProjectFunctionsDto> {
    constructor() {
      super(ProjectFunctionsEntity);
    }
}