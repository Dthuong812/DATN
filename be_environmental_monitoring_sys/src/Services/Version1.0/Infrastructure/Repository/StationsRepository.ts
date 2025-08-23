import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { StationsDao } from "../Dao/StationsDao";
import { StationsEntity } from "../../Domain/Models/stations.entity";
import { StationsDto } from "../../Domain/Dtos/stations.dto";

@Injectable()
export class StationsRepository extends CoreRepositoryBase<StationsEntity, StationsDto> {
    constructor(
        private readonly StationsDao: StationsDao
    ) {
        super([StationsDao]);
    }

}