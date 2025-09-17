import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { DepartmentService } from "../Application/Services/DepartmentService";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { CreateDepartmentDto, PayloadFilterDepartmentDto, UpdateDepartmentDto } from "../Domain/Dto/department.dto";
import { GetCurrentUserId, RequirePermission } from "src/common/decorators";
import { EnumQuyen } from "src/common/EnumQuyen";
import { MessagePattern } from "@nestjs/microservices";

@ApiBearerAuth("JWT")
@Controller("department")
export class DepartmentController {
  constructor(private readonly DepartmentService: DepartmentService) {}
  @MessagePattern('message_get_all_dept')
  @Get()
  @RequirePermission({ Func: "FUNC_DEPT", Permission: EnumQuyen.CREATE })
  @ApiOperation({ summary: "Lấy tất cả phòng ban" })
  async getAll(@Query() query: PayloadFilterDepartmentDto) {
    return this.DepartmentService.getAll(query);
  }

  @Post()
  @RequirePermission({ Func: "FUNC_DEPT", Permission: EnumQuyen.CREATE })
  @ApiOperation({ summary: "Tạo phòng ban mới" })
  async createDepartment(
    @Body() payload: CreateDepartmentDto,
    @GetCurrentUserId() authId: number
  ) {
    payload.CreatedBy = authId;
    return this.DepartmentService.create(payload);
  }

  @Patch("/:Id")
  @RequirePermission({ Func: "FUNC_DEPT", Permission: EnumQuyen.UPDATE })
    @ApiOperation({ summary: "Cập nhật phòng ban" })
    async updateDepartment(
      @Param("Id") Id: number,
      @Body() payload: UpdateDepartmentDto,
      @GetCurrentUserId() authId: number
    ) {
      payload.UpdatedBy = authId;
      return this.DepartmentService.update({Id},payload);
    }
   @Delete("/:Id")
    @RequirePermission({ Func: "FUNC_DEPT", Permission: EnumQuyen.DELETE })
    @ApiOperation({ summary: "Xóa phòng ban" })
    async deleteDepartment(@Param("Id") Id: number) {
        return this.DepartmentService.deleteDepartment(Id);
    }
    @Get("/:Id")
    @RequirePermission({ Func: "FUNC_DEPT", Permission: EnumQuyen.READ })
    @ApiOperation({ summary: "Lấy phòng ban theo Id" })
    async getById(@Param("Id") Id: number) {
        return this.DepartmentService.getById(Id);
    }
}
