import { UserEntity } from "src/Services/Domain/Models/users.entity";
import { CoreDaoBase } from "./CoreDaoBase";
import { UserDto } from "src/Services/Domain/Dtos/users.dto";

export class UserDao extends CoreDaoBase<UserEntity, UserDto> {
    constructor() {
      super(UserEntity);
    }
  }