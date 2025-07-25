import { UserEntity } from 'src/Services/Domain/Models/users.entity';
import { Injectable } from "@nestjs/common";
import { UserDto } from 'src/Services/Domain/Dtos/users.dto';
import { CoreRepositoryBase } from './CoreRepositoryBase';
import { UserDao } from '../Dao/UserDao';

@Injectable()
export class UserRepsitory extends CoreRepositoryBase<UserEntity, UserDto> {
    constructor(
        private readonly userDao: UserDao
    ) {
        super([userDao]);
    }
    
}