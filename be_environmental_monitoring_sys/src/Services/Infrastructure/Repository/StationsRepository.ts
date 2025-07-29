import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { StationsEntity } from "src/Services/Domain/Models/stations.entity";
import { StationsDto } from "src/Services/Domain/Dtos/stations.dto";
import { StationsDao } from "../Dao/StationsDao";

@Injectable()
export class StationsRepository extends CoreRepositoryBase<StationsEntity, StationsDto> {
    constructor(
        private readonly StationsDao: StationsDao
    ) {
        super([StationsDao]);
    }

}