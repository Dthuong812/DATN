import { DeviceDataDto } from "../../Domain/Dto/device_data.dto";
import { DeviceDataEntity } from "../../Domain/Models/device_data.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class DeviceDataDao extends CoreDaoBase<DeviceDataEntity, DeviceDataDto> {
    constructor() {
      super(DeviceDataEntity);
    }
}