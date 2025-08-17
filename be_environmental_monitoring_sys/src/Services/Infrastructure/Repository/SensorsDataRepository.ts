import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { SensorsDataEntity } from "src/Services/Domain/Models/sensor_data.entity";
import { SensorsDataDto } from "src/Services/Domain/Dtos/sensors_data.dto";
import { SensorsDataDao } from "../Dao/SensorsDataDao";

@Injectable()
export class SensorsDataRepository extends CoreRepositoryBase<SensorsDataEntity, SensorsDataDto> {
    constructor(
        private readonly SensorsDataDao: SensorsDataDao
    ) {
        super([SensorsDataDao]);
    }

}