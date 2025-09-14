import { LocalDto } from "../../Domain/Dto/local.dto";
import { LocalEntity } from "../../Domain/Models/local.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class LocalDao extends CoreDaoBase<LocalEntity, LocalDto> {
    constructor() {
      super(LocalEntity);
    }
}