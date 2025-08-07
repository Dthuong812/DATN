import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { SensorsTypesEntity } from "src/Services/Domain/Models/sensor_types.entity";
import { SensorTypesDto } from "src/Services/Domain/Dtos/sersor_types.dto";
import { SensorTypesDao } from "../Dao/SensorTypesDao";

@Injectable()
export class SensorTypesRepository extends CoreRepositoryBase<SensorsTypesEntity, SensorTypesDto> {
    constructor(
        private readonly SensorTypesDao: SensorTypesDao
    ) {
        super([SensorTypesDao]);
    }
}