import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { SensorsEntity } from "src/Services/Domain/Models/sensors.entity";
import { SensorsDto } from "src/Services/Domain/Dtos/sensors.dto";
import { SensorsRepository } from "src/Services/Infrastructure/Repository/SensorsRepository";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { StationsRepository } from "src/Services/Infrastructure/Repository/StationsRepository";
import { SensorTypesRepository } from "src/Services/Infrastructure/Repository/SensorTypesRepository";
import { SensorsDataRepository } from "src/Services/Infrastructure/Repository/SensorsDattaRepository";
import { DevicesRepository } from "src/Services/Infrastructure/Repository/DevicesRepository";

@Injectable()
export class SensorsService extends CoreServiceBase<SensorsEntity, SensorsDto> {
  constructor(
    private readonly SensorsRepository: SensorsRepository,
    private readonly DevicesRepository: DevicesRepository,
    private readonly SensorTypesRepository:SensorTypesRepository ,
  ) {
    super(SensorsRepository);
  }
  async getAllSensors(): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const [sensors, devices, sensorTypes] = await Promise.all([
        this.SensorsRepository.getAll(),
        this.DevicesRepository.getAll(),
        this.SensorTypesRepository.getAll(),
      ]);;
      const deviceMap = new Map(devices.map(s => [s.Id, s.Name]));
      const typeMap = new Map(sensorTypes.map(t => [t.Id, t.Name]));
  
      const result = sensors.map(sensor => ({
        ...sensor,
        Device: deviceMap.get(sensor.DeviceId) || null,
        SeriesDevice:sensor.Series,
        SensorType: typeMap.get(sensor.TypeId) || null
      }));
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lí thành công";
      res.Data = result;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  async getSensorById(Id: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const sensor = await this.SensorsRepository.getById(Id);
      if (!sensor) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Cảm biến không tồn tại";
        return res;
      }
      const [device,sensorType] = await Promise.all([
        this.DevicesRepository.getById(sensor.DeviceId),
        this.SensorTypesRepository.getById(sensor.TypeId),
      ]);
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lí thành công";
      res.Data = {
        ...sensor,
        Device: device ? device.Name : null,
        SeriesDevice: device ? device.Series : null,
        SensorType: sensorType ? sensorType.Name : null
      };
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
}
