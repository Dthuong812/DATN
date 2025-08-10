import { SensorsRepository } from "./../../Infrastructure/Repository/SensorsRepository";
import { Injectable } from "@nestjs/common";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { ResultResponse } from "src/common/ResultResponse";
import {
  SensorTypesDto,
} from "src/Services/Domain/Dtos/sersor_types.dto";
import { SensorsTypesEntity } from "src/Services/Domain/Models/sensor_types.entity";
import { SensorTypesRepository } from "src/Services/Infrastructure/Repository/SensorTypesRepository";
import { CoreServiceBase } from "./CoreServiceBase";

@Injectable()
export class SensorTypesService extends CoreServiceBase<
  SensorsTypesEntity,
  SensorTypesDto
> {
  constructor(
    private readonly SensorTypesRepository: SensorTypesRepository,
    private readonly SensorsRepository: SensorsRepository
  ) {
    super(SensorTypesRepository);
  }
  async getAllSensorTypes(): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const sensorTypes = await this.SensorTypesRepository.getAll();
      const result = await Promise.all(
        sensorTypes.map(async (sensorType) => {
          const sensor = await this.SensorsRepository.getAll({
            where: { TypeId: sensorType.Id },
          });
          return {
            ...sensorType,
            TotalSensors: sensor.length,
          };
        })
      );
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lí thành công";
      res.Data = result;
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
      await this.SensorTypesRepository.markAsDeleted({ Id }, authId);
      await this.SensorsRepository.updateMany(
        { TypeId: Id },
        { TypeId: null }
      );
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xóa thành công";
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
      const sensors = await this.SensorsRepository.getAll({ TypeId: Id });
      const result = {
        ...sensorType,
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
