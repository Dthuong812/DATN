import { DevicesDto } from "../../Domain/Dtos/devices.dto";
import { DevicesEntity } from "../../Domain/Models/devices.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class DevicesDao extends CoreDaoBase<DevicesEntity, DevicesDto> {
    constructor() {
      super(DevicesEntity);
    }
}