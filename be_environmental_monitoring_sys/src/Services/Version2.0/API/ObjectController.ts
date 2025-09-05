import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ObjectService } from "../Application/Services/ObjectService";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { GetCurrentUserId, RequirePermission } from "src/common/decorators";
import { EnumQuyen } from "src/common/EnumQuyen";
import { CreateObjectDto, UpdateObjectDto } from "../Domain/Dto/object.dto";

@ApiBearerAuth("JWT")
@Controller("object")
export class ObjectController {
    constructor(private readonly ObjectService:ObjectService
    ){}
    
    @Get()
    @RequirePermission({ Func: "FUNC_OBJECT", Permission: EnumQuyen.READ })
    @ApiOperation({ summary: "Lấy tất cả đối tượng quan trắc" })
    async getAll(){
        return this.ObjectService.getAll();
    }

    @Post()
    @RequirePermission({ Func: "FUNC_OBJECT", Permission: EnumQuyen.CREATE })
    @ApiOperation({ summary: "Tạo đối tượng quan trắc mới" })
    async createObject(@Body() payload: CreateObjectDto, @GetCurrentUserId() authId: number) {
        payload.CreatedBy = authId;
        return this.ObjectService.create( payload);
    }

    @Patch("/:Id")
    @RequirePermission({ Func: "FUNC_OBJECT", Permission: EnumQuyen.UPDATE })
    @ApiOperation({ summary: "Cập nhật đối tượng quan trắc" })
    async updateObject(
      @Param("Id") Id: number,
      @Body() payload: UpdateObjectDto,
      @GetCurrentUserId() authId: number
    ) {
      payload.UpdatedBy = authId;
      return this.ObjectService.update({Id},payload);
    }

    @Delete("/:Id")
    @RequirePermission({ Func: "FUNC_OBJECT", Permission: EnumQuyen.DELETE })
    @ApiOperation({ summary: "Xóa đối tượng quan trắc" })
    async deleteObject(@Param("Id") Id: number) {
        return this.ObjectService.softDelete({Id});
    }

    @Get("/:Id")
    @RequirePermission({ Func: "FUNC_OBJECT", Permission: EnumQuyen.READ }) 
    @ApiOperation({ summary: "Lấy thông tin đối tượng quan trắc theo Id" })
    async getObjectById(@Param("Id") Id: number) {
        return this.ObjectService.getById(Id);
    }
}