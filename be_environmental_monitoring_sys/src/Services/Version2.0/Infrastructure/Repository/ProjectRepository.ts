import { Injectable } from "@nestjs/common";
import { ProjectEntity } from "../../Domain/Models/project.entity";
import { ProjectDto } from "../../Domain/Dto/project.dto";
import { ProjectDao } from "../Dao/ProjectDao";
import { CoreRepositoryBase } from "./CoreRepositoryBase";

@Injectable()
export class ProjectRepository extends CoreRepositoryBase<ProjectEntity, ProjectDto> {
    constructor(
        private readonly ProjectDao: ProjectDao
    ) {
        super([ProjectDao]);
    }
}