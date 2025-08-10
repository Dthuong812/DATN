import { DevicesEntity } from "src/Services/Domain/Models/devices.entity";
import { CoreDaoBase } from "./CoreDaoBase";
import { DevicesDto } from "src/Services/Domain/Dtos/devices.dto";

export class DevicesDao extends CoreDaoBase<DevicesEntity, DevicesDto> {
    constructor() {
      super(DevicesEntity);
    }
}