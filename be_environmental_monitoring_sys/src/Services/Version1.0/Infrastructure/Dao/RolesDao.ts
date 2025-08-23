import { RolesDto } from "../../Domain/Dtos/roles.dto";
import { RolesEntity } from "../../Domain/Models/roles.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class RolesDao extends CoreDaoBase<RolesEntity, RolesDto> {
    constructor() {
      super(RolesEntity);
    }
}