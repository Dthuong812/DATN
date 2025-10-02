import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { DeviceDataEntity } from "../../Domain/Models/device_data.entity";
import { DeviceDataDto } from "../../Domain/Dto/device_data.dto";
import { DeviceDataDao } from "../Dao/DeviceDataDao";

@Injectable()
export class DeviceDataRepository extends CoreRepositoryBase<DeviceDataEntity, DeviceDataDto> {
    constructor(
        private readonly DeviceDataDao: DeviceDataDao
    ) {
        super([DeviceDataDao]);
    }
}