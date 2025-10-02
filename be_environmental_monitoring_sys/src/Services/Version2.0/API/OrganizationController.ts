import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { OrganizationService } from "../Application/Services/OrganizationService";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from "../Domain/Dto/organization.dto";
import { GetCurrentUserId, RequirePermission } from "src/common/decorators";
import { EnumQuyen } from "src/common/EnumQuyen";
import { MessagePattern } from "@nestjs/microservices";

@ApiBearerAuth("JWT")
@Controller("organization")
export class OrganizationController {
  constructor(private readonly OrganizationService: OrganizationService,) {}
  @MessagePattern('message_get_all_org')
  @Get()
  @ApiOperation({ summary: "Lấy tất cả dự án mới" })
  async getAll() {
    return this.OrganizationService.getAll();
  }
  @Post()
  @ApiOperation({ summary: "Tạo tổ chức mới" })
  @RequirePermission({ Func: "FUNC_ORG", Permission: EnumQuyen.CREATE })
  async createOrganization(
    @Body() payload: CreateOrganizationDto,
    @GetCurrentUserId() authId: number
  ) {
    return this.OrganizationService.createOrganization(payload, authId);
  }

  @Patch("/:Id")
  @RequirePermission({ Func: "FUNC_ORG", Permission: EnumQuyen.UPDATE })
  @ApiOperation({ summary: "Cập nhật tổ chức" })
  async updateOrganization(
    @Param("Id") Id: number,
    @Body() payload: UpdateOrganizationDto,
    @GetCurrentUserId() authId: number
  ) {
    return this.OrganizationService.updateOrganization(Id, payload, authId);
  }
  @Delete("/:Id")
  @RequirePermission({ Func: "FUNC_ORG", Permission: EnumQuyen.DELETE })
  @ApiOperation({ summary: "Xóa tổ chức" })
  async deleteOrganization(@Param("Id") Id: number) {
    return this.OrganizationService.deleteOrganization(Id);
  }

  @Get("/:Id")
  @RequirePermission({ Func: "FUNC_ORG", Permission: EnumQuyen.READ })
  @ApiOperation({ summary: "Lấy thông tin tổ chức theo Id" })
  async getOrganizationById(@Param("Id") Id: number) {
    return this.OrganizationService.getById(Id);
  }
}
