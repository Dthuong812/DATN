import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { SensorsDao } from "../Dao/SensorsDao";
import { SensorsEntity } from "../../Domain/Models/sensors.entity";
import { SensorsDto } from "../../Domain/Dtos/sensors.dto";

@Injectable()
export class SensorsRepository extends CoreRepositoryBase<SensorsEntity, SensorsDto> {
    constructor(
        private readonly SensorsDao: SensorsDao
    ) {
        super([SensorsDao]);
    }
    
}