import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { DepartmentService } from "../Application/Services/DepartmentService";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { CreateDepartmentDto, UpdateDepartmentDto } from "../Domain/Dto/department.dto";
import { GetCurrentUserId } from "src/common/decorators";

@ApiBearerAuth("JWT")
@Controller("department")
export class DepartmentController {
  constructor(private readonly DepartmentService: DepartmentService) {}
  @Get()
  @ApiOperation({ summary: "Lấy tất cả phòng ban" })
  async getAll() {
    return this.DepartmentService.getAll();
  }

  @Post()
  @ApiOperation({ summary: "Tạo phòng ban mới" })
  async createDepartment(
    @Body() payload: CreateDepartmentDto,
    @GetCurrentUserId() authId: number
  ) {
    payload.CreatedBy = authId;
    return this.DepartmentService.create(payload);
  }

  @Patch("/:Id")
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
    @ApiOperation({ summary: "Xóa phòng ban" })
    async deleteDepartment(@Param("Id") Id: number) {
        return this.DepartmentService.deleteDepartment(Id);
    }
}
