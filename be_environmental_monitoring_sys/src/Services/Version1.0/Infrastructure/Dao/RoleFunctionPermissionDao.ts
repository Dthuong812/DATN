
import { RoleFunctionPermissionDto } from "../../Domain/Dtos/role_function_permission.dto";
import { RoleFunctionPermissionEntity } from "../../Domain/Models/role_function_permission.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class RoleFunctionPermissionDao extends CoreDaoBase<RoleFunctionPermissionEntity, RoleFunctionPermissionDto> {
    constructor() {
      super(RoleFunctionPermissionEntity);
    }
}