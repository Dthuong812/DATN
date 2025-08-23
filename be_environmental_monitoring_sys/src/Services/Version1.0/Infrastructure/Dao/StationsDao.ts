import { StationsDto } from "../../Domain/Dtos/stations.dto";
import { StationsEntity } from "../../Domain/Models/stations.entity";
import { CoreDaoBase } from "./CoreDaoBase";


export class StationsDao extends CoreDaoBase<StationsEntity,StationsDto> {
    constructor() {
      super(StationsEntity);
    }
}