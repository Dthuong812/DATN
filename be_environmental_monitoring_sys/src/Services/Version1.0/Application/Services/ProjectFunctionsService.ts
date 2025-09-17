import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { ProjectFunctionsEntity } from "../../Domain/Models/project-functions.entity";
import { ProjectFunctionsDto } from "../../Domain/Dtos/project_functions.dto";
import { ProjectFunctionsRepository } from "../../Infrastructure/Repository/ProjectFunctionsRepository";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { FunctionsRepository } from "../../Infrastructure/Repository/FunctionsRepository";
import { In } from "typeorm";

@Injectable()
export class ProjectFunctionsService extends CoreServiceBase<ProjectFunctionsEntity, ProjectFunctionsDto> {
  constructor(private readonly ProjectFunctionsRepository: ProjectFunctionsRepository,
    private readonly FunctionsRepository: FunctionsRepository
  ) {
    super(ProjectFunctionsRepository);
  }
  async getAllFunction(ProjectId: number): Promise<ResultResponse> {
    const  res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
        const projectFunctions = await this.ProjectFunctionsRepository.getAll({where: {ProjectId: ProjectId}});
        const functions = projectFunctions.map(pf => pf.FunctionId);
        const list = await this.FunctionsRepository.getAll({ where: { Id: In(functions) } });
        res.Status = ErrorCode.SUCCESS;
        res.Message = "Xử lí thành công";
        res.Data = list
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
}