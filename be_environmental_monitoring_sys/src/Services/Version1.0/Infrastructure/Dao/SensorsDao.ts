import { SensorsDto } from "../../Domain/Dtos/sensors.dto";
import { SensorsEntity } from "../../Domain/Models/sensors.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class SensorsDao extends CoreDaoBase<SensorsEntity, SensorsDto> {
    constructor() {
      super(SensorsEntity);
    }
}