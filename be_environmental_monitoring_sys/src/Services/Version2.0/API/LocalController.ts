import { Controller, Get, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { LocalService } from "../Application/Services/LocalService";

@ApiBearerAuth("JWT")
@Controller("local")
export class LocalController {
  constructor(private readonly LocalService: LocalService) {}
  @Get("/:Id")
  @ApiOperation({ summary: "Lấy tỉnh thành phố theo Id" })
  async getById(@Param("Id") Id: number) {
    return this.LocalService.getById(Id);
  }
  @Get()
  @ApiOperation({ summary: "Lấy tất cả tỉnh thành phố" })
  async getAll() {
    return this.LocalService.getAll();
  }
}
