import { UserFunctionPermissionDto } from "../../Domain/Dtos/user_function_permission.dto";
import { UserFunctionPermissionEntity } from "../../Domain/Models/user_function_permission.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class UserFunctionPermissionDao extends CoreDaoBase<UserFunctionPermissionEntity, UserFunctionPermissionDto> {
    constructor() {
      super(UserFunctionPermissionEntity);
    }
    
}