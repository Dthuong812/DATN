import { RoleFunctionPermissionDao } from './../Dao/RoleFunctionPermissionDao';
import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from './CoreRepositoryBase';
import { RoleFunctionPermissionEntity } from '../../Domain/Models/role_function_permission.entity';
import { RoleFunctionPermissionDto } from '../../Domain/Dtos/role_function_permission.dto';
@Injectable()
export class RoleFunctionPermissionRepository extends CoreRepositoryBase<RoleFunctionPermissionEntity, RoleFunctionPermissionDto> {
    constructor(
        private readonly roleFunctionPermissionDao: RoleFunctionPermissionDao
    ) {
        super([roleFunctionPermissionDao]);
    }

}