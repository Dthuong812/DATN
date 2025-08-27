import { Injectable } from "@nestjs/common";
import { ProjectEntity } from "../../Domain/Models/project.entity";
import { ProjectDto } from "../../Domain/Dto/project.dto";
import { ProjectRepository } from "../../Infrastructure/Repository/ProjectRepository";
import { CoreServiceBase } from "./CoreServiceBase";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";

@Injectable()
export class ProjectService extends CoreServiceBase<ProjectEntity, ProjectDto> {
  constructor(private readonly ProjectRepository: ProjectRepository) {
    super(ProjectRepository);
  }
  async deleteProject(Id: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
        const project = await this.ProjectRepository.getById(Id);
        if (!project) {
          res.Status = ErrorCode.NOT_FOUND_ID;
          res.Message = "Dự án không tồn tại";
          return res;
        }
        await this.ProjectRepository.delete({Id});
        res.Status = ErrorCode.SUCCESS;
        res.Message = "Xử lí thành công";
        res.Data = null;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
}
