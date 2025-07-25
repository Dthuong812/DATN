import { RoleFunctionPermissionEntity } from "src/Services/Domain/Models/role_function_permission.entity";
import { CoreDaoBase } from "./CoreDaoBase";
import { RoleFunctionPermissionDto } from "src/Services/Domain/Dtos/role_function_permission.dto";

export class RoleFunctionPermissionDao extends CoreDaoBase<RoleFunctionPermissionEntity, RoleFunctionPermissionDto> {
    constructor() {
      super(RoleFunctionPermissionEntity);
    }
}