import { Controller, Delete, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { DeviceDataService } from "../Application/Services/DeviceDataService";
import { RequirePermission } from "src/common/decorators";
import { EnumQuyen } from "src/common/EnumQuyen";
import { Ctx, MessagePattern, MqttContext, Payload } from "@nestjs/microservices";
import { FilterDeviceDataDto } from "../Domain/Dto/device_data.dto";

@ApiBearerAuth("JWT")
@Controller("device-data")
export class DeviceDataController {
  constructor(private readonly DeviceDataService: DeviceDataService) {}
  @Get()
  @ApiOperation({ summary: "Lấy tất cả dữ liệu thiết bị" })
  @RequirePermission({ Func: "FUNC_DEVICEDATA", Permission: EnumQuyen.READ})
  async getAllDeviceDatas(@Query() filter:FilterDeviceDataDto) {
    return this.DeviceDataService.getAll(filter);
  }
  @MessagePattern("iot/sensors")
  async handleSensorData(@Payload() payload: any, @Ctx() context: MqttContext) {
    const rawPacket = context.getPacket();
    try {
      const fullPayload = JSON.parse(rawPacket.payload.toString());

      await this.DeviceDataService.processMqttPayload(fullPayload);
    } catch (e) {
      console.error("Error parsing full payload:", e);
    }
  }
}
