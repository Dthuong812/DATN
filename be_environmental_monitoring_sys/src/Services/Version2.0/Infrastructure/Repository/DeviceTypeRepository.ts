import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { DeviceTypeEntity } from "../../Domain/Models/device_type.entity";
import { DeviceTypeDto } from "../../Domain/Dto/device_type.dto";
import { DeviceTypeDao } from "../Dao/DeviceTypeDao";

@Injectable()
export class DeviceTypeRepository extends CoreRepositoryBase<DeviceTypeEntity, DeviceTypeDto> {
    constructor(
        private readonly DeviceTypeDao: DeviceTypeDao
    ) {
        super([DeviceTypeDao]);
    }
}