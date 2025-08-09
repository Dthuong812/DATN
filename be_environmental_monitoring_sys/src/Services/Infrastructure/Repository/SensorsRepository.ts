import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { SensorsEntity } from "src/Services/Domain/Models/sensors.entity";
import { SensorsDto } from "src/Services/Domain/Dtos/sensors.dto";
import { SensorsDao } from "../Dao/SensorsDao";

@Injectable()
export class SensorsRepository extends CoreRepositoryBase<SensorsEntity, SensorsDto> {
    constructor(
        private readonly SensorsDao: SensorsDao
    ) {
        super([SensorsDao]);
    }
    
}