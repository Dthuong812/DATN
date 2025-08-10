import { Injectable } from "@nestjs/common";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { ResultResponse } from "src/common/ResultResponse";
import {
  PayLoadCreateStationDto,
  PayLoadUpdateStationDto,
  StationsDto,
} from "src/Services/Domain/Dtos/stations.dto";
import { Mapper } from "src/Services/Domain/Mapper/Mapper";
import { StationsEntity } from "src/Services/Domain/Models/stations.entity";
import { StationsRepository } from "src/Services/Infrastructure/Repository/StationsRepository";
import { UserService } from "./UserService";
import * as fs from "fs";
import * as XLSX from "xlsx";
import * as path from "path";
import { In } from "typeorm";
import { LocationsRepository } from "src/Services/Infrastructure/Repository/LocationsRepository";
import { CoreServiceBase } from "./CoreServiceBase";
import { DevicesRepository } from "src/Services/Infrastructure/Repository/DevicesRepository";
import { SensorsRepository } from "src/Services/Infrastructure/Repository/SensorsRepository";

@Injectable()
export class StationsService extends CoreServiceBase<
  StationsEntity,
  StationsDto
> {
  constructor(
    private readonly stationsRepository: StationsRepository,
    private readonly userService: UserService,
    private readonly LocationsRepository: LocationsRepository,
    private readonly DevicesRepository: DevicesRepository,
    private readonly SensorsRepository: SensorsRepository
  ) {
    super(stationsRepository);
  }
  async importFromFile(file: Express.Multer.File, authId: number) {
    const ext = path.extname(file.originalname).toLowerCase();
    let rawData: any[] = [];

    try {
      if (ext === ".xlsx" || ext === ".csv") {
        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      } else if (ext === ".json") {
        const content = fs.readFileSync(file.path, "utf-8");
        rawData = JSON.parse(content);
      } else {
        throw new Error(
          "Chỉ hỗ trợ file Excel (.xlsx), CSV (.csv), hoặc JSON (.json)"
        );
      }

      const results = [];

      for (const record of rawData) {
        try {
          const payload: PayLoadCreateStationDto = {
            Name: record.Name,
            Address: record.Address,
            LocationId: +record.LocationId,
            Lat: +record.Lat,
            Lng: +record.Lng,
            Status: +record.Status,
            CreatedBy: authId,
            CreatedAt: new Date(),
          };

          const entity = Mapper.mapDtoToEntity(payload, StationsEntity);
          const savedEntity = await this.stationsRepository.create(entity);

          results.push({ success: true, data: savedEntity, payload });
        } catch (err) {
          results.push({ success: false, error: err.message, payload: record });
        }
      }

      fs.unlinkSync(file.path);

      return {
        success: true,
        imported: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        results,
      };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async deleteStation(Id: number, authId: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const station = await this.stationsRepository.getById(Id);
      if (!station) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Không tìm thấy trạm";
        return res;
      }

      await this.stationsRepository.markAsDeleted({ Id }, authId);
      const devices = await this.DevicesRepository.getAll({
        where: { StationId: Id },
      });

      if (devices.length > 0) {
        const deviceIds = devices.map((d) => d.Id);

        await this.DevicesRepository.updateMany(
          { StationId: Id },
          { StationId: null, Status: 0, UpdatedBy: authId }
        );
        await this.SensorsRepository.updateMany(
          { DeviceId: In(deviceIds) } as any,
          { Status: 0, UpdatedBy: authId, UpdatedAt: new Date() }
        );
      }

      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xóa thành công";
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }

  async getStationById(Id: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const station = await this.stationsRepository.getById(Id);
      if (!station) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Không tìm thấy trạm";
        return res;
      }
      const LocationList = await this.LocationsRepository.getAll();
      const locationMap = new Map(
        LocationList.map((loc) => [loc.Id, loc.Name])
      );
      const result = {
        Id: station.Id,
        Name: station.Name,
        Address: station.Address,
        LocationId: locationMap.get(station.LocationId),
        Lat: station.Lat,
        Lng: station.Lng,
        CreatedAt: station.CreatedAt,
        UpdatedAt: station.UpdatedAt,
        CreatedBy: station.CreatedBy,
        UpdatedBy: station.UpdatedBy,
        DeletedAt: station.DeletedAt,
        DeletedBy: station.DeletedBy,
        Status: station.Status,
      };
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lí thành công";
      res.Data = result;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  async getAllStations(): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const stations = await this.stationsRepository.getAll();
      const LocationList = await this.LocationsRepository.getAll();
      const locationMap = new Map(
        LocationList.map((loc) => [loc.Id, loc.Name])
      );
      const result = stations.map((station) => ({
        Id: station.Id,
        Name: station.Name,
        Address: station.Address,
        LocationId: locationMap.get(station.LocationId),
        Lat: station.Lat,
        Lng: station.Lng,
        CreatedAt: station.CreatedAt,
        UpdatedAt: station.UpdatedAt,
        CreatedBy: station.CreatedBy,
        UpdatedBy: station.UpdatedBy,
        DeletedAt: station.DeletedAt,
        DeletedBy: station.DeletedBy,
        Status: station.Status,
      }));
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lí thành công";
      res.Data = result;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
}
