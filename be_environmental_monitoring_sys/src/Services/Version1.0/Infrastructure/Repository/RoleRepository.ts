import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { RolesDao } from "../Dao/RolesDao";
import { RolesEntity } from "../../Domain/Models/roles.entity";
import { RolesDto } from "../../Domain/Dtos/roles.dto";

@Injectable()
export class RolesRepository extends CoreRepositoryBase<RolesEntity, RolesDto> {
    constructor(
        private readonly rolesDao: RolesDao
    ) {
        super([rolesDao]);
    }

}