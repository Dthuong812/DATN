import { MessagePattern } from '@nestjs/microservices';
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ProjectService } from "../Application/Services/ProjectService";
import { CreateProjectDto, UpdateProjectDto } from "../Domain/Dto/project.dto";
import { RequirePermission } from "src/common/decorators";
import { EnumQuyen } from "src/common/EnumQuyen";

@ApiBearerAuth("JWT")
@Controller("project")
export class ProjectController {
  constructor(private readonly ProjectService: ProjectService) {}
  @MessagePattern('message_getAll_projects')
  @Get()
  async getAllProjects() {
    return this.ProjectService.getAll();
  }

  @Post()
  @ApiOperation({ summary: "Tạo dự án mới" })
  @RequirePermission({ Func: "FUNC_PROJECT", Permission: EnumQuyen.CREATE })
  async createProject(@Body() payload: CreateProjectDto) {
    return this.ProjectService.create(payload);
  }

  @Patch("/:Id")
  @ApiOperation({ summary: "Cập nhật dự án" })
  @RequirePermission({ Func: "FUNC_PROJECT", Permission: EnumQuyen.UPDATE })
  async updateProject(@Body() payload: UpdateProjectDto ,@Param('Id') Id: number) {
    return this.ProjectService.updateProject(Id,payload);
  }

  @Delete("/:Id")
  @ApiOperation({ summary: "Xóa dự án" })
  @RequirePermission({ Func: "FUNC_PROJECT", Permission: EnumQuyen.DELETE })
  async deleteProject(@Param("Id") Id: number) {
    return await this.ProjectService.deleteProject(Id);
  }

  @Get("/:Id")
  @ApiOperation({ summary: "Lấy thông tin dự án theo Id" })
  @RequirePermission({ Func: "FUNC_PROJECT", Permission: EnumQuyen.READ })
  async getProjectById(@Param("Id") Id: number) {
    return this.ProjectService.getById(Id);
  }
}
