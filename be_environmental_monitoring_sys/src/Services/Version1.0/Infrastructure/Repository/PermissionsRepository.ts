import { Injectable } from "@nestjs/common";
import { PermissionsDao } from "../Dao/PermissionsDao";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { PermissionsEntity } from "../../Domain/Models/permissions.entity";
import { PermissionsDto } from "../../Domain/Dtos/permissions.dto";

@Injectable()
export class PermissionsRepository extends CoreRepositoryBase<
  PermissionsEntity,
  PermissionsDto
> {
  constructor(private readonly permissionsDao: PermissionsDao) {
    super([permissionsDao]);
  }
}
