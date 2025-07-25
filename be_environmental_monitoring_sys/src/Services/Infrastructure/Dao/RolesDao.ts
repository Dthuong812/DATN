import { RolesEntity } from "src/Services/Domain/Models/roles.entity";
import { CoreDaoBase } from "./CoreDaoBase";
import { RolesDto } from "src/Services/Domain/Dtos/roles.dto";

export class RolesDao extends CoreDaoBase<RolesEntity, RolesDto> {
    constructor() {
      super(RolesEntity);
    }
}