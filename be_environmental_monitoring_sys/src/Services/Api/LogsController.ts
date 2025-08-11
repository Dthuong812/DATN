import { Controller, Get} from "@nestjs/common";
import { LocationsService } from "../Application/Services/LocationService";
import { ResultResponse } from "src/common/ResultResponse";
import { LogsService } from "../Application/Services/LogsService";
import { ApiBearerAuth } from "@nestjs/swagger";

@ApiBearerAuth("JWT")
@Controller("/logs")
export class LogsController {
  constructor(private readonly LogsService: LogsService,
  ) {}

  @Get()
  async getAllLogs(): Promise<ResultResponse> {
    return await this.LogsService.getAllLogs();
  }
}
