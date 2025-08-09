import { SensorsEntity } from "src/Services/Domain/Models/sensors.entity";
import { CoreDaoBase } from "./CoreDaoBase";
import { SensorsDto } from "src/Services/Domain/Dtos/sensors.dto";

export class SensorsDao extends CoreDaoBase<SensorsEntity, SensorsDto> {
    constructor() {
      super(SensorsEntity);
    }
}