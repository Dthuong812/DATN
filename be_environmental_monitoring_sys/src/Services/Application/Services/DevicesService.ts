import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { DevicesEntity } from "src/Services/Domain/Models/devices.entity";
import { DevicesDto } from "src/Services/Domain/Dtos/devices.dto";
import { DevicesRepository } from "src/Services/Infrastructure/Repository/DevicesRepository";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { SensorsRepository } from "src/Services/Infrastructure/Repository/SensorsRepository";

@Injectable()
export class DevicesService extends CoreServiceBase<DevicesEntity, DevicesDto> {
  constructor(private readonly DevicesRepository: DevicesRepository,
                private readonly SensorsRepository: SensorsRepository
  ) {
    super(DevicesRepository);
  }
  async deleteDevice(Id: number, authId:number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
        const device = await this.DevicesRepository.getById(Id);
        if (!device) {
            res.Status = ErrorCode.NOT_FOUND_ID;
            res.Message = "Thiết bị không tồn tại";
            return res;
        }
        await this.DevicesRepository.markAsDeleted({ Id }, authId);
        await this.SensorsRepository.updateMany(
            { DeviceId: Id },
            { DeviceId: null , Status: 0 , UpdatedAt: new Date(), UpdatedBy: authId }
          );
        res.Status = ErrorCode.SUCCESS;
        res.Message = "Xóa thành công";
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = "Xóa thất bại";
    }
    return res;
  }

  async getAllDevices(): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const devices = await this.DevicesRepository.getAll();
      const result = await Promise.all(
        devices.map(async (device) => {
          const sensors = await this.SensorsRepository.getAll({
            where: { DeviceId: device.Id },
          });
          return {
            ...device,
            TotalSensors: sensors.length,
          };
        })
      );
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lí thành công";
      res.Data =  result;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }

  async getDeviceById(Id: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const device = await this.DevicesRepository.getById(Id);
      if (!device) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Thiết bị không tồn tại";
        return res;
      }
      const sensors = await this.SensorsRepository.getAll({
        where: { DeviceId: device.Id },
      });
      const result = {
        ...device,
        TotalSensors: sensors.length,
        Sensors: sensors,
      };
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lí thành công";
      res.Data = result;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
}
