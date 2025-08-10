import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { DevicesService } from "../Application/Services/DevicesService";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import {
  PayLoadDeviceCreateDto,
  PayLoadDeviceUpdateDto,
} from "../Domain/Dtos/devices.dto";
import { ResultResponse } from "src/common/ResultResponse";
import { GetCurrentUserId } from "src/common/decorators";

@ApiBearerAuth("JWT")
@Controller("/devices")
export class DevicesController {
  constructor(private readonly DevicesService: DevicesService) {}

  @Post()
  @ApiOperation({ summary: "Tạo thiết bị mới" })
  async createDevice(
    @Body() dto: PayLoadDeviceCreateDto,
    @GetCurrentUserId() authId: number
  ): Promise<ResultResponse> {
    const payload = {
      ...dto,
      CreatedAt: new Date(),
      CreatedBy: authId,
      Status: 0,
    };
    return await this.DevicesService.create(payload);
  }

  @Patch("/:Id")
  @ApiOperation({ summary: "Cập nhật thông tin thiết bị" })
  async updateDevice(
    @Param("Id") Id: number,
    @Body() dto: PayLoadDeviceUpdateDto,
    @GetCurrentUserId() authId: number
  ): Promise<ResultResponse> {
    dto.Id = Id;
    const payload = { ...dto, UpdatedAt: new Date(), UpdatedBy: authId };
    return await this.DevicesService.update({ Id }, payload);
  }
  @Delete("/:Id")
  @ApiOperation({ summary: "Xóa thiết bị" })
  async deleteDevice(
    @Param("Id") Id: number,
    @GetCurrentUserId() authId: number
  ): Promise<ResultResponse> {
    return await this.DevicesService.deleteDevice(Id, authId);
  }

  @Get()
  @ApiOperation({ summary: "Lấy danh sách thiết bị" })
  async getAllDevices(): Promise<ResultResponse> {
    return await this.DevicesService.getAllDevices();
  }

  @Get("/:Id")
  @ApiOperation({ summary: "Lấy thông tin thiết bị" })
  async getDeviceById(@Param("Id") Id: number): Promise<ResultResponse> {
    return await this.DevicesService.getDeviceById(Id);
  }

  
}
