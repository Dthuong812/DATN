import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { UserFunctionPermissionEntity } from "../../Domain/Models/user_function_permission.entity";
import { UserFunctionPermissionDto } from "../../Domain/Dtos/user_function_permission.dto";
import { UserFunctionPermissionDao } from "../Dao/UserFunctionPermissionDao";

@Injectable()
export class UserFunctionPermissionRepository extends CoreRepositoryBase<UserFunctionPermissionEntity, UserFunctionPermissionDto> {
    constructor(
        private readonly UserFunctionPermissionDao: UserFunctionPermissionDao
    ) {
        super([UserFunctionPermissionDao]);
    }
    
}