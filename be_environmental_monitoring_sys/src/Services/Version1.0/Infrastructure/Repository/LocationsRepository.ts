import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { LocationsDao } from "../Dao/LocationsDao";
import { LocationsEntity } from "../../Domain/Models/locations.entity";
import { LocationsDto } from "../../Domain/Dtos/locations.dto";

@Injectable()
export class LocationsRepository extends CoreRepositoryBase<LocationsEntity, LocationsDto> {
    constructor(
        private readonly LocationsDao: LocationsDao
    ) {
        super([LocationsDao]);
    }

   
}