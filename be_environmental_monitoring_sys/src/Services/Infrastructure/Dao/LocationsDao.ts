import { LocationsEntity } from "src/Services/Domain/Models/locations.entity";
import { CoreDaoBase } from "./CoreDaoBase";
import { LocationsDto } from "src/Services/Domain/Dtos/locations.dto";

export class LocationsDao extends CoreDaoBase<LocationsEntity, LocationsDto> {
    constructor() {
      super(LocationsEntity);
    }
}