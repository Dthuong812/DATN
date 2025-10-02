import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { DeviceEntity } from "../../Domain/Models/devices.entity";
import { DeviceDto } from "../../Domain/Dto/devices.dto";
import { DeviceDao } from "../Dao/DeviceDao";

@Injectable()
export class DeviceRepository extends CoreRepositoryBase<DeviceEntity, DeviceDto> {
    constructor(
        private readonly DeviceDao: DeviceDao
    ) {
        super([DeviceDao]);
    }
}