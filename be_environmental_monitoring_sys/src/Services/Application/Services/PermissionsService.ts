import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { PermissionsEntity } from "src/Services/Domain/Models/permissions.entity";
import { PermissionsDto } from "src/Services/Domain/Dtos/permissions.dto";
import { PermissionsRepository } from "src/Services/Infrastructure/Repository/PermissionsRepository";

@Injectable()
export class PermissionsService extends CoreServiceBase<PermissionsEntity, PermissionsDto> {
  constructor(private readonly PermissionsRepository: PermissionsRepository) {
    super(PermissionsRepository);
  }
}