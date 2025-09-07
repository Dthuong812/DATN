import { DeviceDto } from "../../Domain/Dto/devices.dto";
import { DeviceEntity } from "../../Domain/Models/devices.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class DeviceDao extends CoreDaoBase<DeviceEntity, DeviceDto> {
    constructor() {
      super(DeviceEntity);
    }
}