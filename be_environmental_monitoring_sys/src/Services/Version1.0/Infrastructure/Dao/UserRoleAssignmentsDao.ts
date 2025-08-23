import { UserRoleAssignmentsDto } from "../../Domain/Dtos/user_role_assignments.dto";
import { UserRoleAssignmentsEntity } from "../../Domain/Models/user_role_assignments.entity";
import { CoreDaoBase } from "./CoreDaoBase";


export class UserRoleAssignmentsDao extends CoreDaoBase<UserRoleAssignmentsEntity, UserRoleAssignmentsDto> {
    constructor() {
      super(UserRoleAssignmentsEntity);
    }
    
}