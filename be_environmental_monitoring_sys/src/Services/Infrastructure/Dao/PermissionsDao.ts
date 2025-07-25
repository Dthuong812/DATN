import { PermissionsEntity } from "src/Services/Domain/Models/permissions.entity";
import { CoreDaoBase } from "./CoreDaoBase";
import { PermissionsDto } from "src/Services/Domain/Dtos/permissions.dto";

export class PermissionsDao extends CoreDaoBase<PermissionsEntity, PermissionsDto> {
    constructor() {
      super(PermissionsEntity);
    }
}