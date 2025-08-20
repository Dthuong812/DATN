import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { UserRoleAssignmentsEntity } from "src/Services/Domain/Models/user_role_assignments.entity";
import { UserRoleAssignmentsDto } from "src/Services/Domain/Dtos/user_role_assignments.dto";
import { UserRoleAssignmentsDao } from "../Dao/UserRoleAssignmentsDao";

@Injectable()
export class UserRoleAssignmentsRepository extends CoreRepositoryBase<UserRoleAssignmentsEntity, UserRoleAssignmentsDto> {
    constructor(
        private readonly UserRoleAssignmentsDao: UserRoleAssignmentsDao
    ) {
        super([UserRoleAssignmentsDao]);
    }
    
}