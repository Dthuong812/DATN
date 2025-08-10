import { SensorsDataDto } from "src/Services/Domain/Dtos/sensors_data.dto";
import { CoreDaoBase } from "./CoreDaoBase";
import { SensorsDataEntity } from "src/Services/Domain/Models/sensor_data.entity";

export class SensorsDataDao extends CoreDaoBase<SensorsDataEntity, SensorsDataDto> {
    constructor() {
      super(SensorsDataEntity);
    }
}