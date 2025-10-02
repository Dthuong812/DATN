import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from './CoreRepositoryBase';
import { UserDao } from '../Dao/UserDao';
import { UserEntity } from "../../Domain/Models/users.entity";
import { UserDto } from "../../Domain/Dtos/users.dto";

@Injectable()
export class UserRepository extends CoreRepositoryBase<UserEntity, UserDto> {
    constructor(
        private readonly userDao: UserDao
    ) {
        super([userDao]);
    }
    async getPayloadByName(username: string) {
        const user = await this.userDao.getPayloadByName(username);
        return user;
    }
}