import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { SensorTypesService } from "../Application/Services/SensorTypesService";
import { payLoadCreateSensorTypeDto, payLoadUpdateSensorTypeDto } from "../Domain/Dtos/sersor_types.dto";
import { ResultResponse } from "src/common/ResultResponse";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { GetCurrentUserId } from "src/common/decorators";

@Controller("/sensor-types")
export class SensorTypesController {
  constructor(private readonly SensorTypesService: SensorTypesService) {}
  @Post()
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Tạo loại thiết bị mới" })
  async createSensorType(
    @Body() payload: payLoadCreateSensorTypeDto,
    @GetCurrentUserId() authId: number
  ): Promise<ResultResponse> {
    const pl = { ...payload, CreatedBy: authId, CreatedAt: new Date() };
    return this.SensorTypesService.create(pl);
  }

  @Get()
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Lấy danh sách loại thiết bị" })
  async getAllSensorTypes(): Promise<ResultResponse> {
    return this.SensorTypesService.getAllSensorTypes();
  }
  
  @Patch("/:Id")
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Cập nhật loại thiết bị" })
  async updateSensorType(
    @Param("Id", ParseIntPipe) Id: number,
    @Body() payload: payLoadUpdateSensorTypeDto,
    @GetCurrentUserId() authId: number
  ): Promise<ResultResponse> {
    payload.Id = Id;
    const pl = { ...payload, UpdatedBy: authId, UpdatedAt: new Date() };
    return this.SensorTypesService.update({Id}, pl);
  }
  @Delete("/:Id")
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Xoá loại thiết bị" })
  async deleteSensorType(@Param("Id") Id: number,
    @GetCurrentUserId() authId: number
  ): Promise<ResultResponse> {
    return this.SensorTypesService.deleteSensorType(Id, authId);
  }
  @Get("/:Id")
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Lấy thông tin loại thiết bị" })
  async getSensorTypeById(@Param("Id") Id: number): Promise<ResultResponse> {
    return this.SensorTypesService.getSensorTypeById(Id);
  }
}
