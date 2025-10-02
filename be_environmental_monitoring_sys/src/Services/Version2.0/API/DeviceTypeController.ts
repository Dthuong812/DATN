import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { DeviceTypeService } from "../Application/Services/DeviceTypeService";
import { RequirePermission } from "src/common/decorators";
import { EnumQuyen } from "src/common/EnumQuyen";
import { CreateDeviceTypeDto, UpdateDeviceTypeDto } from "../Domain/Dto/device_type.dto";

@ApiBearerAuth("JWT")
@Controller("device-type")
export class DeviceTypeController {
  constructor(private readonly DeviceTypeService: DeviceTypeService) {}
  @Get()
  @ApiOperation({ summary: "Lấy tất cả loại thiết bị" })
  async getAllDeviceTypes() {
    return this.DeviceTypeService.getAll();
  }

  @Post()
  @ApiOperation({ summary: "Tạo dự loại thiết bị mới" })
  @RequirePermission({ Func: "FUNC_DEVICETYPE", Permission: EnumQuyen.CREATE })
  async createDeviceType(@Body() payload: CreateDeviceTypeDto) {
    return this.DeviceTypeService.create(payload);
  }

  @Patch("/:Id")
  @ApiOperation({ summary: "Cập nhật loại thiết bị" })
  @RequirePermission({ Func: "FUNC_DEVICETYPE", Permission: EnumQuyen.UPDATE })
  async updateDeviceType(@Body() payload: UpdateDeviceTypeDto ,@Param('Id') Id: number) {
    return this.DeviceTypeService.update({Id},payload);
  }

  @Get("/:Id")
  @ApiOperation({ summary: "Lấy thông tin loại thiết bị theo Id" })
  @RequirePermission({ Func: "FUNC_DEVICETYPE", Permission: EnumQuyen.READ })
  async getDeviceTypeById(@Param("Id") Id: number) {
    return this.DeviceTypeService.getById(Id);
  }

  @Delete("/:Id")
  @ApiOperation({ summary: "Xóa loại thiết bị" })
  @RequirePermission({ Func: "FUNC_DEVICETYPE", Permission: EnumQuyen.DELETE })
  async deleteDeviceType(@Param("Id") Id: number) {
    return await this.DeviceTypeService.deleteDeviceType(Id);
  }

}