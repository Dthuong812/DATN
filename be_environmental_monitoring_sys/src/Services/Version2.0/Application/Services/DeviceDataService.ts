import { DeviceRepository } from "./../../Infrastructure/Repository/DeviceRepository";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { CoreServiceBase } from "./CoreServiceBase";
import { DeviceDataEntity } from "../../Domain/Models/device_data.entity";
import {
  DeviceDataDto,
  FilterDeviceDataDto,
} from "../../Domain/Dto/device_data.dto";
import { DeviceDataRepository } from "../../Infrastructure/Repository/DeviceDataRepository";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { Between, Like } from "typeorm";
import { ObjectRepository } from "../../Infrastructure/Repository/ObjectRepository";
import { group } from "console";

@Injectable()
export class DeviceDataService extends CoreServiceBase<
  DeviceDataEntity,
  DeviceDataDto
> {
  constructor(
    private readonly deviceDataRepository: DeviceDataRepository,
    private readonly DeviceRepository: DeviceRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly ObjectRepository: ObjectRepository,
  ) {
    super(deviceDataRepository);
  }

  async processMqttPayload(data: any) {
    const mac = data.devices_code;
    if (!mac) {
      console.warn("No devices_code (MAC) in payload, skip");
      return null;
    }

    const object_code = await this.DeviceRepository.getAll({
      where: { Code: mac },
    });
    const entity: Partial<DeviceDataEntity> = {
      Devices_Code: mac,
      Project_Code: data.project_code || null,
      Object_Code: object_code.length > 0 ? object_code[0].Object_Code : null,
      Times: data.times ? new Date(data.times) : new Date(),
      Longitude: object_code.length > 0 ? object_code[0].Longitude : null,
      Latitude: object_code.length > 0 ? object_code[0].Latitude : null,
      Speed: data.speed ?? null,
      DataType: data.datatype || 1,
      DataJson: data.data ?? {},
    };

    const savedEntity = await this.deviceDataRepository.create(entity);
    if (entity.DataJson && Object.keys(entity.DataJson).length > 0 && entity.Object_Code) {
      const existingObject = await this.ObjectRepository.getAll({
        where: { Code: entity.Object_Code },
      });
  
      const updatedDetailsValue = {
        ...(existingObject[0]?.Details_Value || {}),
        Note: "Trạm đang hoạt động",
      };
  
      await this.ObjectRepository.update(
        { Code: entity.Object_Code }, 
        { Status: 1, Details_Value: updatedDetailsValue } 
      );
    }
  

    this.eventEmitter.emit("device.data.saved", entity);

    return savedEntity;
  }

  // @Cron("*/5 * * * * *") 
  // async generateMockData() {
  //   const devices = await this.DeviceRepository.getAll();
  //   if (!devices || devices.length === 0) {
  //     console.warn("No devices found in the repository.");
  //     return;
  //   }

  //   for (const device of devices) {
  //     const mockData = {
  //       devices_code: device.Code,
  //       project_code: "EcoMonitor",
  //       times: new Date().toISOString(),
  //       longitude: device.Longitude,
  //       latitude: device.Latitude,
  //       speed: 1,
  //       datatype: 1,
  //       data: {
  //         temperature: this.generateRandomValue(20, 40),
  //         humidity: this.generateRandomValue(30, 90),
  //         pressure: this.generateRandomValue(950, 1050),
  //         iaq: this.generateRandomValue(0, 500),
  //         sound_level: this.generateRandomValue(30, 120),
  //         distance: this.generateRandomValue(0, 400),
  //       },
  //     };

  //     await this.processMqttPayload(mockData);
  //   }
  // }

  // private generateRandomValue(min: number, max: number): number {
  //   return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  // }

  async getLatestDeviceData() {
    return await this.deviceDataRepository.getAll({
      order: { Times: "DESC" },
    });
  }
  async getLatestDeviceDatas() {
    return await this.deviceDataRepository.getLatestAll();
  }

  async getAll(filter: FilterDeviceDataDto): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const where: any = {};
      if (filter.Devices_Code) where.Devices_Code = Like(`%${filter.Devices_Code}%`);
      if (filter.Project_Code) where.Project_Code = Like(`%${filter.Project_Code}%`);
      if (filter.Object_Code) where.Object_Code = Like(`%${filter.Object_Code}%`);
      if (filter.DataType) where.DataType = Like(`%${filter.DataType}%`);  
      const page = Number(filter.page ?? 1);
      const pageSize = Number(filter.pageSize ?? 10);
      const skip = (page - 1) * pageSize;
      const take = pageSize;
      const data = await this.deviceDataRepository.getAll({
        where, skip, take ,
        order: { Times: "DESC" },
      });
      const total = await this.deviceDataRepository.getAll({ where });
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Lấy dữ liệu thành công";
      res.Data = 
      {
        data: data,
        total: total.length,
        page: page,
        pageSize: pageSize,
      };

      return res;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
      return res;
    }
  }

  @Cron("5 * * * *") 
  async aggregateHourlyData() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const deviceCodes = await this.DeviceRepository.getAll();
    for (const { Code: Devices_Code } of deviceCodes) {
      const dataInLastHour = await this.deviceDataRepository.getAll({
        where: {
          Devices_Code,
          DataType: 1,
          Times: Between(oneHourAgo, now),
        },
      });

      if (dataInLastHour.length > 0) {
        const aggregatedData = this.calculateAverageData(dataInLastHour);
        const aggregatedEntity: Partial<DeviceDataEntity> = {
          Devices_Code,
          Project_Code: dataInLastHour[0].Project_Code,
          Object_Code: dataInLastHour[0].Object_Code,
          Times: now,
          DataType: 2,
          DataJson: aggregatedData,
        };
        await this.deviceDataRepository.create(aggregatedEntity);
      }
    }
  }
  @Cron("0 1 * * *")
  async aggregateDailyData() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const deviceCodes = await this.DeviceRepository.getAll();
    for (const { Code: Devices_Code } of deviceCodes) {
      const dataInLastDay = await this.deviceDataRepository.getAll({
        where: {
          Devices_Code,
          DataType: 2,
          Times: Between(oneDayAgo, now),
        },
      });

      if (dataInLastDay.length > 0) {
        const aggregatedData = this.calculateAverageData(dataInLastDay);

        const aggregatedEntity: Partial<DeviceDataEntity> = {
          Devices_Code,
          Project_Code: dataInLastDay[0].Project_Code,
          Object_Code: dataInLastDay[0].Object_Code,
          Times: now,
          DataType: 3,
          DataJson: aggregatedData,
        };
        await this.deviceDataRepository.create(aggregatedEntity);
      }
    }
  }
  private calculateAverageData(dataArray: DeviceDataEntity[]): Record<string, any> {
    if (!dataArray || dataArray.length === 0) {
      return {};
    }

    const firstItemData = dataArray[0].DataJson;
    const fieldsToAggregate = Object.keys(firstItemData).filter(key => typeof firstItemData[key] === 'number');

    const sums: Record<string, number> = {};
    fieldsToAggregate.forEach(field => sums[field] = 0);

    dataArray.forEach(item => {
      fieldsToAggregate.forEach(field => {
        if (typeof item.DataJson[field] === 'number') {
          sums[field] += item.DataJson[field];
        }
      });
    });

    const averages: Record<string, number> = {};
    fieldsToAggregate.forEach(field => {
      averages[field] = parseFloat((sums[field] / dataArray.length).toFixed(2));
    });

    return averages;
  }

  @Cron("*/5 * * * *") 
  async checkInactiveObjects() {
    const now = new Date();
    const fiveSecondsAgo = new Date(now.getTime() - 5 * 1000);

    const objects = await this.ObjectRepository.getAll();

    for (const object of objects) {
      const recentData = await this.deviceDataRepository.getAll({
        where: {
          Object_Code: object.Code,
          Times: Between(fiveSecondsAgo, now),
        },
      });

      if (recentData.length === 0) {
        const updatedDetailsValue = {
          ...(object.Details_Value || {}),
          Note: "Trạm không hoạt động",
        };

        await this.ObjectRepository.update(
          { Code: object.Code },
          { Status: 0, Details_Value: updatedDetailsValue }
        );
      }
    }
  }
}
