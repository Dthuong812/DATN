import { Controller, Get } from "@nestjs/common";
import { SensorConfigService } from "../Application/Services/SensorConfigService";
import { Public } from "src/common/decorators";

@Controller("config")
export class SensorConfigController {
  constructor(private readonly SensorConfigService: SensorConfigService) {}
  @Get()
  @Public()
  async getAllSensorConfigs() {
    return this.SensorConfigService.getAll();
  }
  @Get("/:Id")
  @Public()
  async getSensorConfigById(Id: number) {
    return this.SensorConfigService.getById(Id);
  }
}
