import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { OrganizationEntity } from "../../Domain/Models/organization.entity";
import { OrganizationDto } from "../../Domain/Dto/organization.dto";
import { OrganizationDao } from "../Dao/OrganizationDao";

@Injectable()
export class OrganizationRepository extends CoreRepositoryBase<OrganizationEntity, OrganizationDto> {
    constructor(
        private readonly OrganizationDao: OrganizationDao
    ) {
        super([OrganizationDao]);
    }
}