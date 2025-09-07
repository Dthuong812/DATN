import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { DeviceService } from "../Application/Services/DeviceService";
import { CreateDeviceDto, UpdateDeviceDto } from "../Domain/Dto/devices.dto";
import { GetCurrentUserId } from "src/common/decorators";

@ApiBearerAuth("JWT")
@Controller("device")
export class DeviceController {
  constructor(private readonly DeviceService: DeviceService) {}
  @Get()
  @ApiOperation({ summary: "Lấy tất cả thiết bị" })
  async getAllDevices() {
    return this.DeviceService.getAll();
  }

  @Post()
  @ApiOperation({ summary: "Tạo thiết bị mới" })
  async createDevice(
    @Body() payload: CreateDeviceDto,
    @GetCurrentUserId() userId: number
  ) {
    payload.CreatedBy = userId;
    return this.DeviceService.create(payload);
  }

  @Patch("/:Id")
  @ApiOperation({ summary: "Cập nhật thiết bị" })
  async updateDevice(
    @Param("Id") Id: number,
    @Body() payload: UpdateDeviceDto,
    @GetCurrentUserId() userId: number
  ) {
    payload.UpdatedBy = userId;
    return this.DeviceService.update({Id}, payload);
  }

    @Get("/:Id")
    @ApiOperation({ summary: "Lấy thông tin thiết bị theo Id" })
    async getDeviceById(@Param("Id") Id: number) {
      return this.DeviceService.getById(Id);
    }

    @Delete("/:Id")
    @ApiOperation({ summary: "Xóa thiết bị" })
    async deleteDevice(@Param("Id") Id: number) {
      return await this.DeviceService.deleteDevice(Id);
    }
}
