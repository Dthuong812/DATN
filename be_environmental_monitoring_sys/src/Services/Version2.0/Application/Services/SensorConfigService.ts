import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { SensorConfigEntity } from "../../Domain/Models/sensor-config.entity";
import { SensorConfigDto } from "../../Domain/Dto/sensor-config.dto";
import { SensorConfigRepository } from "../../Infrastructure/Repository/SensorConfigRepository";

@Injectable()
export class SensorConfigService extends CoreServiceBase<SensorConfigEntity, SensorConfigDto> {
  constructor(
    private readonly SensorConfigRepository: SensorConfigRepository,
  ) {
    super(SensorConfigRepository);
  }
}