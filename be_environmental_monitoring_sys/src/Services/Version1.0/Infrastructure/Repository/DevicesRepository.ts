import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { DevicesDao } from "../Dao/DevicesDao";
import { DevicesEntity } from "../../Domain/Models/devices.entity";
import { DevicesDto } from "../../Domain/Dtos/devices.dto";

@Injectable()
export class DevicesRepository extends CoreRepositoryBase<DevicesEntity, DevicesDto> {
    constructor(
        private readonly DevicesDao: DevicesDao
    ) {
        super([DevicesDao]);
    }

}