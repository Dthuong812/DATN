import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { DeviceService } from "../Application/Services/DeviceService";
import { CreateDeviceDto, FilterDeviceDto, UpdateDeviceDto } from "../Domain/Dto/devices.dto";
import { GetCurrentUserId, RequirePermission } from "src/common/decorators";
import { EnumQuyen } from "src/common/EnumQuyen";

@ApiBearerAuth("JWT")
@Controller("device")
export class DeviceController {
  constructor(private readonly DeviceService: DeviceService) {}
  @Get()
  @ApiOperation({ summary: "Lấy tất cả thiết bị" })
  @RequirePermission({ Func: "FUNC_DEVICE", Permission: EnumQuyen.READ })
  async getAllDevices(@Query() filter: FilterDeviceDto) {
    return this.DeviceService.getAll(filter);
  }

  @Post()
  @ApiOperation({ summary: "Tạo thiết bị mới" })
  @RequirePermission({ Func: "FUNC_DEVICE", Permission: EnumQuyen.READ })
  async createDevice(
    @Body() payload: CreateDeviceDto,
    @GetCurrentUserId() userId: number
  ) {
    payload.CreatedBy = userId;
    return this.DeviceService.create(payload);
  }

  @Patch("/:Id")
  @ApiOperation({ summary: "Cập nhật thiết bị" })
  @RequirePermission({ Func: "FUNC_DEVICEDATA", Permission: EnumQuyen.UPDATE })
  async updateDevice(
    @Param("Id") Id: number,
    @Body() payload: UpdateDeviceDto,
    @GetCurrentUserId() userId: number
  ) {
    payload.UpdatedBy = userId;
    return this.DeviceService.update({ Id }, payload);
  }

  @Get("/:Id")
  @ApiOperation({ summary: "Lấy thông tin thiết bị theo Id" })
  @RequirePermission({ Func: "FUNC_DEVICE", Permission: EnumQuyen.READ })
  async getDeviceById(@Param("Id") Id: number) {
    return this.DeviceService.getById(Id);
  }

  @Delete("/:Id")
  @ApiOperation({ summary: "Xóa thiết bị" })
  @RequirePermission({ Func: "FUNC_DEVICE", Permission: EnumQuyen.DELETE })
  async deleteDevice(@Param("Id") Id: number) {
    return await this.DeviceService.deleteDevice(Id);
  }
  
}
