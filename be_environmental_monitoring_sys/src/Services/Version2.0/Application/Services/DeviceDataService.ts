import { DeviceRepository } from './../../Infrastructure/Repository/DeviceRepository';
import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { DeviceDataEntity } from "../../Domain/Models/device_data.entity";
import { DeviceDataDto } from "../../Domain/Dto/device_data.dto";
import { DeviceDataRepository } from "../../Infrastructure/Repository/DeviceDataRepository";

@Injectable()
export class DeviceDataService extends CoreServiceBase<DeviceDataEntity, DeviceDataDto> {
  constructor(private readonly deviceDataRepository: DeviceDataRepository,
    private readonly DeviceRepository: DeviceRepository
  ) {
    super(deviceDataRepository);
  }

  async processMqttPayload(data: any) {
    const mac = data.devices_code;
    if (!mac) {
      console.warn("⚠️ No devices_code (MAC) in payload, skip");
      return null;
    }
    const object_code = await this.DeviceRepository.getAll({ where: { Code: mac } });

    const entity: Partial<DeviceDataEntity> = {
      Devices_Code: mac,
      Project_Code: data.project_code || null,
      Object_Code: object_code.length > 0 ? object_code[0].Object_Code : null,
      Times: data.times ? new Date(data.times) : new Date(),
      Longitude: data.longitude ?? null,
      Latitude: data.latitude ?? null,
      Speed: data.speed ?? null,
      DataType: data.datatype || 1,
      DataJson: data.data ?? {},
    };

    console.log("💾 Saving entity:", entity);
    return this.deviceDataRepository.create(entity);
  }
}
