import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { RolesEntity } from "src/Services/Domain/Models/roles.entity";
import { RolesDto } from "src/Services/Domain/Dtos/roles.dto";
import { RolesDao } from "../Dao/RolesDao";

@Injectable()
export class RolesRepository extends CoreRepositoryBase<RolesEntity, RolesDto> {
    constructor(
        private readonly rolesDao: RolesDao
    ) {
        super([rolesDao]);
    }

}