import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { SensorTypesDao } from "../Dao/SensorTypesDao";
import { SensorsTypesEntity } from "../../Domain/Models/sensor_types.entity";
import { SensorTypesDto } from "../../Domain/Dtos/sersor_types.dto";

@Injectable()
export class SensorTypesRepository extends CoreRepositoryBase<SensorsTypesEntity, SensorTypesDto> {
    constructor(
        private readonly SensorTypesDao: SensorTypesDao
    ) {
        super([SensorTypesDao]);
    }
}