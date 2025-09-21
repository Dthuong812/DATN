import { ProjectOrganizationRepository } from './../../Infrastructure/Repository/ProjectOrganizationRepository';
import { Inject, Injectable } from "@nestjs/common";
import { ProjectEntity } from "../../Domain/Models/project.entity";
import { CreateProjectDto, ProjectDto } from "../../Domain/Dto/project.dto";
import { ProjectRepository } from "../../Infrastructure/Repository/ProjectRepository";
import { CoreServiceBase } from "./CoreServiceBase";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { REQUEST } from "@nestjs/core";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { Mapper } from "../../Domain/Mapper/Mapper";

@Injectable()
export class ProjectService extends CoreServiceBase<ProjectEntity, ProjectDto> {
  constructor(
    private readonly ProjectRepository: ProjectRepository,
    private readonly ProjectOrganizationRepository: ProjectOrganizationRepository,
    @Inject("app") private client: ClientProxy,
    @Inject(REQUEST) readonly request: Request
  ) {
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
      await this.client.emit("delete_project_function", { ProjectId: Id });
      await this.ProjectOrganizationRepository.delete({ ProjectId: Id });
      await this.ProjectRepository.delete({ Id });
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lí thành công";
      res.Data = null;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }

  async create(payload: CreateProjectDto): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const project = await this.ProjectRepository.create({
        Name: payload.Name,
        Code: payload.Code,
        Description: payload.Description,
      });
      if (payload.Functions && payload.Functions.length > 0) {
        for (const f of payload.Functions) {
          this.client.emit("create_project_function", {
            ProjectId: project.Id,
            FunctionId: f.Id,
          });
        }
      }
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lí thành công";
      res.Data = project;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }

  async getById(Id: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const project = await this.ProjectRepository.getById(Id);
      if (!project) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Dự án không tồn tại";
        return res;
      }
      const functions = await lastValueFrom(
        this.client.send("get_project_function_by_project_id", {
          ProjectId: Id,
        })
      );
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lí thành công";
      res.Data = {
        ...project,
        Functions: functions?.Data ?? [],
      };
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  async updateProject(Id: number, payload: CreateProjectDto): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const project = await this.ProjectRepository.getById(Id);
      if (!project) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Dự án không tồn tại";
        return res;
      }
      const newProject = await this.ProjectRepository.update(
        { Id },
        Mapper.mapDtoToEntity({
          Name: payload.Name,
          Code: payload.Code,
          Description: payload.Description,
        }, ProjectEntity)
      );
      await this.client.emit("delete_project_function", { ProjectId: Id });
      if (payload.Functions && payload.Functions.length > 0) {
        for (const f of payload.Functions) {
          this.client.emit("create_project_function", {
            ProjectId: newProject.Id,
            FunctionId: f.Id,
          });
        }
      }
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Cập nhật thành công";
      res.Data = newProject;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  async getAll(): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
  
    try {
      const projects = await this.ProjectRepository.getAll();
      const projectsWithFunctions = [];
      for (const project of projects) {
        const functions = await lastValueFrom(
          this.client.send("get_project_function_by_project_id", {
            ProjectId: project.Id,
          })
        );
  
        projectsWithFunctions.push({
          ...project,
          Functions: functions.Data ?? [], 
        });
      }
  
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lí thành công";
      res.Data = projectsWithFunctions;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
  
    return res;
  }
  
}
