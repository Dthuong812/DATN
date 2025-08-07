import { SensorsTypesEntity } from "src/Services/Domain/Models/sensor_types.entity";
import { CoreDaoBase } from "./CoreDaoBase";
import { SensorTypesDto } from "src/Services/Domain/Dtos/sersor_types.dto";

export class SensorTypesDao extends CoreDaoBase<SensorsTypesEntity, SensorTypesDto> {
    constructor() {
      super(SensorsTypesEntity);
    }
}