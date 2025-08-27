import { OrganizationDto } from "../../Domain/Dto/organization.dto";
import { OrganizationEntity } from "../../Domain/Models/organization.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class OrganizationDao extends CoreDaoBase<OrganizationEntity, OrganizationDto> {
    constructor() {
      super(OrganizationEntity);
    }
}