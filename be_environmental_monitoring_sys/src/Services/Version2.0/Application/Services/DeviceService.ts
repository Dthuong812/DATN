import { DeviceDataRepository } from './../../Infrastructure/Repository/DeviceDataRepository';
import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { DeviceEntity } from "../../Domain/Models/devices.entity";
import { DeviceDto, FilterDeviceDto } from "../../Domain/Dto/devices.dto";
import { DeviceRepository } from "../../Infrastructure/Repository/DeviceRepository";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { Like } from 'typeorm';

@Injectable()
export class DeviceService extends CoreServiceBase<DeviceEntity, DeviceDto> {
  constructor(private readonly DeviceRepository: DeviceRepository,
    private readonly DeviceDataRepository: DeviceDataRepository,
  ) {
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
        await this.DeviceDataRepository.delete({Devices_Code: device.Code});
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
  async getAll(filter: FilterDeviceDto):Promise<ResultResponse>{
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try{
      const where: any = {};
      if (filter.Code)
        where.Code = Like(`%${filter.Code}%`);
      if (filter.Name)
        where.Name = Like(`%${filter.Name}%`);
      if (filter.DeviceType_Code)
        where.DeviceType_Code = Like(`%${filter.DeviceType_Code}%`);
      if (filter.Object_Code)
        where.Object_Code = Like(`%${filter.Object_Code}%`);
      if (filter.Series)
        where.Series = Like(`%${filter.Series}%`);
      const page = Number(filter.page ?? 1);
      const pageSize = Number(filter.pageSize ?? 10);
      const skip = (page - 1) * pageSize;
      const take = pageSize;

        const devices = await this.DeviceRepository.getAll({ where, skip, take });
        const total = await this.DeviceRepository.getAll(where);
        res.Status = ErrorCode.SUCCESS;
        res.Message = "Xử lí thành công";
        res.Data = {
          data: devices,
          total: total.length,
          page: page,
          pageSize: pageSize,
        }
    }
    catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
}