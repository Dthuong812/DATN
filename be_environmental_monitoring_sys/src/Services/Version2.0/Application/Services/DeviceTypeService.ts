import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { DeviceTypeEntity } from "../../Domain/Models/device_type.entity";
import { DeviceTypeDto } from "../../Domain/Dto/device_type.dto";
import { DeviceTypeRepository } from "../../Infrastructure/Repository/DeviceTypeRepository";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { DeviceRepository } from "../../Infrastructure/Repository/DeviceRepository";

@Injectable()
export class DeviceTypeService extends CoreServiceBase<
  DeviceTypeEntity,
  DeviceTypeDto
> {
  constructor(private readonly DeviceTypeRepository: DeviceTypeRepository,
    private readonly DeviceRepository: DeviceRepository
  ) {
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
        await this.DeviceRepository.delete({DeviceType_Code: deviceType.Code});
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
