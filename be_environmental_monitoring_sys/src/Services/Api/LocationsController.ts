import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { LocationsService } from "../Application/Services/LocationService";
import {
  PayloadCreateLocationDto,
  PayloadUpdateLocationDto,
} from "../Domain/Dtos/locations.dto";
import { ResultResponse } from "src/common/ResultResponse";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { GetCurrentUserId } from "src/common/decorators";

@Controller("/locations")
export class LocationsController {
  constructor(private readonly LocationsService: LocationsService) {}

  @Post()
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Tạo khu vực mới" })
  async createLocation(
    @Body() payload: PayloadCreateLocationDto
  ): Promise<ResultResponse> {
    return await this.LocationsService.create(payload);
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
    Id: number,
    @GetCurrentUserId() authId: number
  ): Promise<ResultResponse> {
    return await this.LocationsService.deleteLocation(Id,authId);
  }
  @Patch("/:Id")
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Cập nhật khu vực theo Id" })
  async updateLocation(
    @Param("Id", ParseIntPipe) Id: number,
    @Body() payload: PayloadUpdateLocationDto
  ): Promise<ResultResponse> {
    payload.Id = Id;
    const pl = { ...payload };
    return await this.LocationsService.update({ Id }, pl);
  }

  @Post("import")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now();
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`
          );
        },
      }),
    })
  )
  async import(@UploadedFile() file: Express.Multer.File) {
    return this.LocationsService.importFromFile(file);
  }
}
