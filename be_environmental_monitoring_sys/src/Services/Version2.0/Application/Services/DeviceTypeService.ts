import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { DeviceTypeEntity } from "../../Domain/Models/device_type.entity";
import { DeviceTypeDto } from "../../Domain/Dto/device_type.dto";
import { DeviceTypeRepository } from "../../Infrastructure/Repository/DeviceTypeRepository";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";

@Injectable()
export class DeviceTypeService extends CoreServiceBase<
  DeviceTypeEntity,
  DeviceTypeDto
> {
  constructor(private readonly DeviceTypeRepository: DeviceTypeRepository) {
    super(DeviceTypeRepository);
  }

  async deleteDeviceType(Id: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
        const deviceType = await this.DeviceTypeRepository.getById(Id);
        if (!deviceType) {
          res.Status = ErrorCode.NOT_FOUND_ID;
          res.Message = "Loại thiết bị không tồn tại";
          return res;
        }
        // XÓA THIẾT BỊ TRƯỚC KHI XÓA LOẠI THIẾT BỊ
        await this.DeviceTypeRepository.delete({Id});
        res.Status = ErrorCode.SUCCESS;
        res.Message = "Xử lí thành công";
        res.Data = null;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
}
