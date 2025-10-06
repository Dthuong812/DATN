import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { SensorConfigEntity } from "../../Domain/Models/sensor-config.entity";
import { SensorConfigDto } from "../../Domain/Dto/sensor-config.dto";
import { SensorConfigDao } from "../Dao/SensorConfigDao";

@Injectable()
export class SensorConfigRepository extends CoreRepositoryBase<SensorConfigEntity, SensorConfigDto> {
    constructor(
        private readonly SensorConfigDao: SensorConfigDao
    ) {
        super([SensorConfigDao]);
    }
}