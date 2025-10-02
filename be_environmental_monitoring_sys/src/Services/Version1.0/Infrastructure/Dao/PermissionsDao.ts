import { PermissionsDto } from "../../Domain/Dtos/permissions.dto";
import { PermissionsEntity } from "../../Domain/Models/permissions.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class PermissionsDao extends CoreDaoBase<PermissionsEntity, PermissionsDto> {
    constructor() {
      super(PermissionsEntity);
    }
}