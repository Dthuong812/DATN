import { UserRoleAssignmentsEntity } from "src/Services/Domain/Models/user_role_assignments.entity";
import { CoreDaoBase } from "./CoreDaoBase";
import { UserRoleAssignmentsDto } from "src/Services/Domain/Dtos/user_role_assignments.dto";

export class UserRoleAssignmentsDao extends CoreDaoBase<UserRoleAssignmentsEntity, UserRoleAssignmentsDto> {
    constructor() {
      super(UserRoleAssignmentsEntity);
    }
    
}