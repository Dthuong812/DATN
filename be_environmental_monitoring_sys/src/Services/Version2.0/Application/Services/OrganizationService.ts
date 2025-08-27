import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { OrganizationEntity } from "../../Domain/Models/organization.entity";
import { OrganizationDto } from "../../Domain/Dto/organization.dto";
import { OrganizationRepository } from "../../Infrastructure/Repository/OrganizationRepository";

@Injectable()
export class OrganizationService extends CoreServiceBase<OrganizationEntity, OrganizationDto> {
  constructor(private readonly OrganizationRepository: OrganizationRepository) {
    super(OrganizationRepository);
  }
}