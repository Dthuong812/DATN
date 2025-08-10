import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { DevicesEntity } from "src/Services/Domain/Models/devices.entity";
import { DevicesDto } from "src/Services/Domain/Dtos/devices.dto";
import { DevicesDao } from "../Dao/DevicesDao";

@Injectable()
export class DevicesRepository extends CoreRepositoryBase<DevicesEntity, DevicesDto> {
    constructor(
        private readonly DevicesDao: DevicesDao
    ) {
        super([DevicesDao]);
    }

}