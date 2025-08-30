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
import { GetCurrentUserId } from "src/common/decorators";

@ApiBearerAuth("JWT")
@Controller("organization")
export class OrganizationController {
  constructor(private readonly OrganizationService: OrganizationService) {}
  @Get()
  @ApiOperation({ summary: "Lấy tất cả dự án mới" })
  async getAll() {
    return this.OrganizationService.getAll();
  }
  @Post()
  @ApiOperation({ summary: "Tạo tổ chức mới" })
  async createOrganization(
    @Body() payload: CreateOrganizationDto,
    @GetCurrentUserId() authId: number
  ) {
    return this.OrganizationService.createOrganization(payload, authId);
  }

  @Patch("/:Id")
  @ApiOperation({ summary: "Cập nhật tổ chức" })
  async updateOrganization(
    @Param("Id") Id: number,
    @Body() payload: UpdateOrganizationDto,
    @GetCurrentUserId() authId: number
  ) {
    return this.OrganizationService.updateOrganization(Id, payload, authId);
  }
  @Delete("/:Id")
  @ApiOperation({ summary: "Xóa tổ chức" })
  async deleteOrganization(@Param("Id") Id: number) {
    return this.OrganizationService.deleteOrganization(Id);
  }

  @Get("/:Id")
  @ApiOperation({ summary: "Lấy thông tin tổ chức theo Id" })
  async getOrganizationById(@Param("Id") Id: number) {
    return this.OrganizationService.getById(Id);
  }
}
