import { SensorTypesDto } from "../../Domain/Dtos/sersor_types.dto";
import { SensorsTypesEntity } from "../../Domain/Models/sensor_types.entity";
import { CoreDaoBase } from "./CoreDaoBase";


export class SensorTypesDao extends CoreDaoBase<SensorsTypesEntity, SensorTypesDto> {
    constructor() {
      super(SensorsTypesEntity);
    }
}