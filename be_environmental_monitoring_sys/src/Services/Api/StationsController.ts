import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { StationsService } from "../Application/Services/StationsService";
import { ApiBearerAuth, ApiBody, ApiOperation } from "@nestjs/swagger";
import {
    DeleteMultipleStationsDto,
  PayLoadCreateStationDto,
  PayLoadUpdateStationDto,
} from "../Domain/Dtos/stations.dto";
import { GetCurrentUserId } from "src/common/decorators";
import { ResultResponse } from "src/common/ResultResponse";
import { diskStorage } from "multer";
import { extname } from "path";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("/stations")
export class StationsController {
  constructor(private readonly StationsService: StationsService) {}
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
  async import(
    @UploadedFile() file: Express.Multer.File,
    @GetCurrentUserId() authId: number
  ) {
    return this.StationsService.importFromFile(file, authId);
  }

  @Post()
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Tạo trạm mới" })
  async createStation(
    @Body() payload: PayLoadCreateStationDto,
    @GetCurrentUserId() authId: number
  ): Promise<ResultResponse> {
    return await this.StationsService.createStation(payload, authId);
  }

  @Patch("/:Id")
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Cập nhật thông tin trạm" })
  async updateStation(
    @Param("Id") Id: number,
    @Body() payload: PayLoadUpdateStationDto,
    @GetCurrentUserId() authId: number
  ): Promise<ResultResponse> {
    return await this.StationsService.updateStation(Id, payload, authId);
  }

  @Delete("/:Id")
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Xóa trạm" })
  async deleteStation(
    @Param("Id") Id: number,
    @GetCurrentUserId() authId: number
  ): Promise<ResultResponse> {
    return await this.StationsService.deleteStation(Id, authId);
  }
  
  @Get()
  @ApiBearerAuth("JWT")
  @ApiOperation({ summary: "Lấy danh sách tất cả trạm" })
  async getAll(): Promise<ResultResponse> {
    return await this.StationsService.getAllStations();
  }
}
