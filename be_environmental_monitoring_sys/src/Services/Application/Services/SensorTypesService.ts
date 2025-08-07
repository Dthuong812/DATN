import { Injectable } from "@nestjs/common";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { ResultResponse } from "src/common/ResultResponse";
import {
  payLoadCreateSensorTypeDto,
  payLoadUpdateSensorTypeDto,
} from "src/Services/Domain/Dtos/sersor_types.dto";
import { Mapper } from "src/Services/Domain/Mapper/Mapper";
import { SensorsTypesEntity } from "src/Services/Domain/Models/sensor_types.entity";
import { SensorTypesRepository } from "src/Services/Infrastructure/Repository/SensorTypesRepository";

@Injectable()
export class SensorTypesService {
  constructor(private readonly SensorTypesRepository: SensorTypesRepository) {}
  async getAllSensorTypes(): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const sensorTypes = await this.SensorTypesRepository.getAll();
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lí thành công";
      res.Data = sensorTypes;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  async createSensorType(
    payload: payLoadCreateSensorTypeDto,
    authId: number
  ): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      if (!payload) {
        res.Status = ErrorCode.INVALID_INPUT;
        res.Message = "Thông tin không hợp lệ";
        return res;
      }
      const SensorTypeList = await this.SensorTypesRepository.getAll();

      const existingSensorType = SensorTypeList.find(
        (sensorType) => sensorType.Name === payload.Name
      );
      if (existingSensorType) {
        res.Status = ErrorCode.SAVE_FAIL;
        res.Message = "Loại cảm biến đã tồn tại";
        return res;
      }
      payload.CreatedBy = authId;
      payload.CreatedAt = new Date();

      const sensorType = await this.SensorTypesRepository.create(
        Mapper.mapDtoToEntity(payload, SensorsTypesEntity)
      );

      res.Status = ErrorCode.SUCCESS;
      res.Message = "Tạo thành công";
      res.Data = sensorType;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  async deleteSensorType(Id: number, authId: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const sensorType = await this.SensorTypesRepository.getById(Id);
      if (!sensorType) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Loại cảm biến không tồn tại";
        return res;
      }
      sensorType.DeletedAt = new Date();
      sensorType.DeletedBy = authId;
      await this.SensorTypesRepository.update({ Id }, sensorType);
      await this.SensorTypesRepository.softDelete({ Id });
      //note : xóa cả các cảm biến liên quan đến loại cảm biến này
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xóa thành công";
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  async updateSensorType(
    Id: number,
    payload: payLoadUpdateSensorTypeDto,
    authId: number
  ): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const sensorType = await this.SensorTypesRepository.getById(Id);
      if (!sensorType) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Loại cảm biến không tồn tại";
        return res;
      }
      const SensorTypeList = await this.SensorTypesRepository.getAll();

      const existingSensorType = SensorTypeList.find(
        (sensorType) => sensorType.Name === payload.Name && sensorType.Id !== Id
      );
      if (existingSensorType) {
        res.Status = ErrorCode.SAVE_FAIL;
        res.Message = "Loại cảm biến đã tồn tại";
        return res;
      }
      payload.UpdatedBy = authId;
      payload.UpdatedAt = new Date();
      const result = await this.SensorTypesRepository.update(
        { Id },
        Mapper.mapDtoToEntity(payload, SensorsTypesEntity)
      );

      res.Status = ErrorCode.SUCCESS;
      res.Message = "Cập nhật thành công";
      res.Data = result;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  async getSensorTypeById(Id: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const sensorType = await this.SensorTypesRepository.getById(Id);
      if (!sensorType) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Loại cảm biến không tồn tại";
        return res;
      }
      const result = {
        ...sensorType,
        // note: thêm các thông tin liên quan
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
