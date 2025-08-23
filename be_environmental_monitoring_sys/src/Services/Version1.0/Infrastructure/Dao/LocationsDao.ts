import { LocationsDto } from "../../Domain/Dtos/locations.dto";
import { LocationsEntity } from "../../Domain/Models/locations.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class LocationsDao extends CoreDaoBase<LocationsEntity, LocationsDto> {
    constructor() {
      super(LocationsEntity);
    }
}