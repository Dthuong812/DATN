import { SensorsDataDto } from "../../Domain/Dtos/sensors_data.dto";
import { SensorsDataEntity } from "../../Domain/Models/sensor_data.entity";
import { CoreDaoBase } from "./CoreDaoBase";
export class SensorsDataDao extends CoreDaoBase<SensorsDataEntity, SensorsDataDto> {
    constructor() {
      super(SensorsDataEntity);
    }
}