import { DeviceDataDto } from "../../Domain/Dto/device_data.dto";
import { DeviceDataEntity } from "../../Domain/Models/device_data.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class DeviceDataDao extends CoreDaoBase<DeviceDataEntity, DeviceDataDto> {
    constructor() {
      super(DeviceDataEntity);
    }
    async getLatestAll() {
      return await this._repository.query(`
        SELECT d.*
        FROM devicedata d
        INNER JOIN (
            SELECT Devices_Code, MAX(Times) AS LatestTime
            FROM devicedata
            GROUP BY Devices_Code
        ) latest ON d.Devices_Code = latest.Devices_Code AND d.Times = latest.LatestTime
        ORDER BY d.Devices_Code;
      `);
    }
}