import { MessagePattern } from '@nestjs/microservices';
import { Body, Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { FunctionsService } from "../Application/Services/FunctionsService";
import { RequirePermission } from "src/common/decorators";
import { EnumQuyen } from "src/common/EnumQuyen";
import { ProjectFunctionsDto } from '../Domain/Dtos/project_functions.dto';

@ApiBearerAuth("JWT")
@Controller("functions")
export class FunctionsController {
  constructor(private readonly FunctionsService: FunctionsService) {}

  @Get("")
  @ApiOperation({ summary: "Lấy tất cả các chức năng" })
  @RequirePermission({ Func: "FUNC_FUNCTION", Permission: EnumQuyen.READ })
  async getAll() {
    return await this.FunctionsService.getAll();
  }

}