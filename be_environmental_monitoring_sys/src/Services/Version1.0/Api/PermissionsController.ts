import { Controller, Get } from "@nestjs/common";
import { PermissionsService } from "../Application/Services/PermissionsService";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { Public, RequirePermission } from "src/common/decorators";
import { EnumQuyen } from "src/common/EnumQuyen";

@ApiBearerAuth("JWT")
@Controller("permissions")
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Public()
  @Get("")
  @ApiOperation({ summary: "Lấy tất cả quyền" })
  @RequirePermission({ Func: "FUNC_PERMISSION", Permission: EnumQuyen.READ })
  async getAll() {
    return await this.permissionsService.getAll();
  }
}
