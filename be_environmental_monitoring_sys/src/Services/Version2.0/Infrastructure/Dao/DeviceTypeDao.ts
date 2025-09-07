import { DeviceTypeDto } from "../../Domain/Dto/device_type.dto";
import { DeviceTypeEntity } from "../../Domain/Models/device_type.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class DeviceTypeDao extends CoreDaoBase<DeviceTypeEntity, DeviceTypeDto> {
    constructor() {
      super(DeviceTypeEntity);
    }
}
