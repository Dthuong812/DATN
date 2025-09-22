import { Controller, Get, Query } from "@nestjs/common";
import { ResultResponse } from "src/common/ResultResponse";
import { LogsService } from "../Application/Services/LogsService";
import { ApiBearerAuth } from "@nestjs/swagger";
import { FilterLogsDto } from "../Domain/Dtos/logs.dto";
import { RequirePermission } from "src/common/decorators";
import { EnumQuyen } from "src/common/EnumQuyen";

@ApiBearerAuth("JWT")
@Controller("/logs")
export class LogsController {
  constructor(private readonly LogsService: LogsService) {}

  @Get()
  @RequirePermission({ Func: "FUNC_LOGS", Permission: EnumQuyen.READ })
  async getAllLogs(@Query() filter: FilterLogsDto): Promise<ResultResponse> {
    return await this.LogsService.getAllLogs(filter);
  }
}
