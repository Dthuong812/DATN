import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { RolesService } from "../Application/Services/RolesService";
import { RequirePermission } from "src/common/decorators";
import { EnumQuyen } from "src/common/EnumQuyen";
import { PayloadCreateRoleDto } from "../Domain/Dtos/roles.dto";

@Controller("roles")
export class RolesController {
  constructor(private readonly RolesService: RolesService) {}

  @Post("")
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Tạo vai trò mới" })
  @RequirePermission({ Func: "FUNC_ROLE", Permission: EnumQuyen.CREATE })
  async createRole(@Body() payload: PayloadCreateRoleDto) {
    return await this.RolesService.createRole(payload);
  }

  @Patch("/:Id")
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Cập nhật vai trò" })
  @RequirePermission({ Func: "FUNC_ROLE", Permission: EnumQuyen.UPDATE })
  async updateRole(@Body() payload: PayloadCreateRoleDto, @Param("Id") Id: number) {
    return await this.RolesService.updateRole(Id, payload);
  }

  @Delete("/:Id")
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Xóa vai trò" })
  @RequirePermission({ Func: "FUNC_ROLE", Permission: EnumQuyen.DELETE })
  async deleteRole(@Param("Id") Id: number) {
    return await this.RolesService.deleteRole(Id);
  }
}
