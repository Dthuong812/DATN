import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { SensorsService } from "../Application/Services/SensorsService";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import {
  PayLoadCreateSensorDto,
  PayLoadUpdateSensorDto,
} from "../Domain/Dtos/sensors.dto";
import { GetCurrentUserId } from "src/common/decorators";
import { ResultResponse } from "src/common/ResultResponse";

@ApiBearerAuth("JWT")
@Controller("sensors")
export class SensorsController {
  constructor(private SensorsService: SensorsService) {}

  @Post()
  @ApiOperation({ summary: "Tạo cảm biến mới" })
  async createSensor(
    @Body() payload: PayLoadCreateSensorDto,
    @GetCurrentUserId() authId: number
  ): Promise<ResultResponse> {
    const pl = { ...payload, CreatedBy: authId, CreatedAt: new Date() };
    return this.SensorsService.create(pl);
  }

  @Patch("/:Id")
  @ApiOperation({ summary: "Cập nhật cảm biến" })
  async updateSensorType(
    @Body() payload: PayLoadUpdateSensorDto,
    @Param("Id", ParseIntPipe) Id: number,
    @GetCurrentUserId() authId: number
  ): Promise<ResultResponse> {
    payload.Id = Id;
    const pl = { ...payload, UpdatedBy: authId, UpdatedAt: new Date() };
    return this.SensorsService.update({ Id }, pl);
  }


  @Delete("/:Id")
  @ApiOperation({ summary: "Xóa cảm biến" })
  async deleteSensor(
    @Param("Id", ParseIntPipe) Id: number,
    @GetCurrentUserId() authId: number
  ): Promise<ResultResponse> {
    return this.SensorsService.markAsDeleted({ Id }, authId);
  }
  
  @Get()
  @ApiOperation({ summary: "Lấy danh sách cảm biến" })
  async getAllSensors(): Promise<ResultResponse> {
    return this.SensorsService.getAllSensors();
  }

  @Get("/:Id")
  @ApiOperation({ summary: "Lấy thông tin cảm biến" })
  async getSensorById(
    @Param("Id", ParseIntPipe) Id: number
  ): Promise<ResultResponse> {
    return this.SensorsService.getSensorById(Id);
  }
}
