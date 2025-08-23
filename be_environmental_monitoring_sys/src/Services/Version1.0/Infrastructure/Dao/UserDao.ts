import { UserDto } from "../../Domain/Dtos/users.dto";
import { UserEntity } from "../../Domain/Models/users.entity";
import { CoreDaoBase } from "./CoreDaoBase";


export class UserDao extends CoreDaoBase<UserEntity, UserDto> {
    constructor() {
      super(UserEntity);
    }
    
}