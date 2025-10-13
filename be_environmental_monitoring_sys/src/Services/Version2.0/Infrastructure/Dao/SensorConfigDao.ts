import { SensorConfigDto } from "../../Domain/Dto/sensor-config.dto";
import { SensorConfigEntity } from "../../Domain/Models/sensor-config.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class SensorConfigDao extends CoreDaoBase<SensorConfigEntity, SensorConfigDto> {
    constructor() {
      super(SensorConfigEntity);
    }
}