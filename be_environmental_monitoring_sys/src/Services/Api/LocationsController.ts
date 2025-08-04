import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { LocationsService } from "../Application/Services/LocationService";
import { PayloadCreateLocationDto } from "../Domain/Dtos/locations.dto";
import { ResultResponse } from "src/common/ResultResponse";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

@Controller("/locations")
export class LocationsController {
  constructor(private readonly LocationsService: LocationsService) {}

  @Post()
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Tạo khu vực mới" })
  async createLocation(
    @Body() payload: PayloadCreateLocationDto
  ): Promise<ResultResponse> {
    return await this.LocationsService.createLocation(payload);
  }

  @Get()
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Lấy danh sách khu vực" })
  async getAllLocations(): Promise<ResultResponse> {
    return await this.LocationsService.getAllLocations();
  }

  @Get("/:Id")
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Lấy thông tin khu vực theo Id" })
  async getLocationById(
    @Param("Id")
    Id: number
  ): Promise<ResultResponse> {
    return await this.LocationsService.getLocationById(Id);
  }
  @Delete("/:Id")
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Xóa khu vực theo Id" })
  async deleteLocation(
    @Param("Id")
    Id: number
  ): Promise<ResultResponse> {
    return await this.LocationsService.deleteLocation(Id);
  }
  @Patch("/:Id")
    @ApiBearerAuth("JWT")
    @ApiOperation({ summary: "Cập nhật khu vực theo Id" })  
    async updateLocation(@Param("Id") Id: number, @Body() payload: PayloadCreateLocationDto): Promise<ResultResponse> {
        return await this.LocationsService.updateLocation(Id, payload);
    }   
}
