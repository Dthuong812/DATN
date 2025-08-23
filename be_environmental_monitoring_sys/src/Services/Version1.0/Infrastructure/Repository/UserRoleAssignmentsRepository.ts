import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";

import { UserRoleAssignmentsDao } from "../Dao/UserRoleAssignmentsDao";
import { UserRoleAssignmentsEntity } from "../../Domain/Models/user_role_assignments.entity";
import { UserRoleAssignmentsDto } from "../../Domain/Dtos/user_role_assignments.dto";

@Injectable()
export class UserRoleAssignmentsRepository extends CoreRepositoryBase<UserRoleAssignmentsEntity, UserRoleAssignmentsDto> {
    constructor(
        private readonly UserRoleAssignmentsDao: UserRoleAssignmentsDao
    ) {
        super([UserRoleAssignmentsDao]);
    }
    
}