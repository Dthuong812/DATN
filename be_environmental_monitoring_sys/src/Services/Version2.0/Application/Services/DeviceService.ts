import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { DeviceEntity } from "../../Domain/Models/devices.entity";
import { DeviceDto } from "../../Domain/Dto/devices.dto";
import { DeviceRepository } from "../../Infrastructure/Repository/DeviceRepository";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";

@Injectable()
export class DeviceService extends CoreServiceBase<DeviceEntity, DeviceDto> {
  constructor(private readonly DeviceRepository: DeviceRepository) {
    super(DeviceRepository);
  }

  async deleteDevice(Id: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try{
        const device = await this.DeviceRepository.getById(Id);
        if (!device) {
          res.Status = ErrorCode.NOT_FOUND_ID;
          res.Message = "Thiết bị không tồn tại";
          return res;
        }
        // XÓA DỮ LIỆU THIẾT BỊ TRƯỚC KHI XÓA THIẾT BỊ
        await this.DeviceRepository.softDelete({Id});
        res.Status = ErrorCode.SUCCESS;
        res.Message = "Xử lí thành công";
        res.Data = null;
    }
    catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
}