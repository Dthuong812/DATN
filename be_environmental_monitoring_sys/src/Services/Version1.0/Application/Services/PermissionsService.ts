import { Inject, Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { PermissionsEntity } from "../../Domain/Models/permissions.entity";
import { PermissionsDto } from "../../Domain/Dtos/permissions.dto";
import { PermissionsRepository } from "../../Infrastructure/Repository/PermissionsRepository";

@Injectable()
export class PermissionsService extends CoreServiceBase<PermissionsEntity, PermissionsDto> {
  constructor(private readonly PermissionsRepository: PermissionsRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache

  ) {
    super(PermissionsRepository);
  }

}