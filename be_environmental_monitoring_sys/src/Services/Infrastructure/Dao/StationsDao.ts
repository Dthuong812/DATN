import { StationsDto } from "src/Services/Domain/Dtos/stations.dto";
import { CoreDaoBase } from "./CoreDaoBase";
import { StationsEntity } from "src/Services/Domain/Models/stations.entity";

export class StationsDao extends CoreDaoBase<StationsEntity,StationsDto> {
    constructor() {
      super(StationsEntity);
    }
}