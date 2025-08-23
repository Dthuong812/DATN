import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { SensorsDataDao } from "../Dao/SensorsDataDao";
import { SensorsDataEntity } from "../../Domain/Models/sensor_data.entity";
import { SensorsDataDto } from "../../Domain/Dtos/sensors_data.dto";

@Injectable()
export class SensorsDataRepository extends CoreRepositoryBase<SensorsDataEntity, SensorsDataDto> {
    constructor(
        private readonly SensorsDataDao: SensorsDataDao
    ) {
        super([SensorsDataDao]);
    }

}