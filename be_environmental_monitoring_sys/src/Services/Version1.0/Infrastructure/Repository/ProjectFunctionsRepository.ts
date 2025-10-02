import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { ProjectFunctionsEntity } from "../../Domain/Models/project-functions.entity";
import { ProjectFunctionsDto } from "../../Domain/Dtos/project_functions.dto";
import { ProjectFunctionsDao } from "../Dao/ProjectFuntionsDao";

@Injectable()
export class ProjectFunctionsRepository extends CoreRepositoryBase<ProjectFunctionsEntity, ProjectFunctionsDto> {
    constructor(
        private readonly ProjectFunctionsDao: ProjectFunctionsDao
    ) {
        super([ProjectFunctionsDao]);
    }

}