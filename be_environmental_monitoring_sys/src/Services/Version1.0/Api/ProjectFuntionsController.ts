import { Body, Controller, Delete, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ProjectFunctionsService } from "../Application/Services/ProjectFunctionsService";
import {
  CreateProjectFunctionsDto,
  ProjectFunctionsDto,
} from "../Domain/Dtos/project_functions.dto";
import { MessagePattern, Payload } from "@nestjs/microservices";

@ApiBearerAuth("JWT")
@Controller("projectfunctions")
export class ProjectFunctionController {
  constructor(
    private readonly ProjectFunctionService: ProjectFunctionsService
  ) {}

  @MessagePattern("create_project_function")
  async create(@Body() payload: CreateProjectFunctionsDto[]) {
    return await this.ProjectFunctionService.createMany(payload);
  }
  @MessagePattern("delete_project_function")
  async delete(@Payload() payload: { ProjectId: number }) {
    return await this.ProjectFunctionService.delete({
      ProjectId: payload.ProjectId,
    });
  }
  @MessagePattern("get_project_function_by_project_id")
  async getByProjectId(@Payload() payload: { ProjectId: number }) {
    return await this.ProjectFunctionService.getAllFunction(payload.ProjectId);
  }
}
