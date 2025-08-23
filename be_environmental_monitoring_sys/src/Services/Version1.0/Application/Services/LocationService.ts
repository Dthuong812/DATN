import { Injectable } from "@nestjs/common";
import path from "path";
import * as XLSX from "xlsx";
import * as fs from "fs";
import { In } from "typeorm";
import { CoreServiceBase } from "./CoreServiceBase";
import { LocationsEntity } from "../../Domain/Models/locations.entity";
import { LocationsDto, PayloadCreateLocationDto } from "../../Domain/Dtos/locations.dto";
import { LocationsRepository } from "../../Infrastructure/Repository/LocationsRepository";
import { StationsRepository } from "../../Infrastructure/Repository/StationsRepository";
import { DevicesRepository } from "../../Infrastructure/Repository/DevicesRepository";
import { SensorsRepository } from "../../Infrastructure/Repository/SensorsRepository";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { Mapper } from "../../Domain/Mapper/Mapper";
@Injectable()
export class LocationsService extends CoreServiceBase<
  LocationsEntity,
  LocationsDto
> {
  constructor(
    private readonly LocationsRepository: LocationsRepository,
    private readonly stationsRepository: StationsRepository,
    private readonly DevicesRepository: DevicesRepository,
    private readonly SensorsRepository: SensorsRepository
  ) {
    super(LocationsRepository);
  }
  async getAllLocations(): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const locations = await this.LocationsRepository.getAll();
      const location = await Promise.all(
        locations.map(async (location) => {
          const stations = await this.stationsRepository.getAll({
            where: { LocationId: location.Id },
          });
          return {
            ...location,
            TotalStations: stations.length,
          };
        })
      );
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lí thành công";
      res.Data = location;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  async getLocationById(Id: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const location = await this.LocationsRepository.getById(Id);
      if (!location) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Không tìm thấy khu vực";
        return res;
      }
      const stations = await this.stationsRepository.getAll({
        where: { LocationId: location.Id },
      });
      const result = {
        ...location,
        TotalStations: stations.length,
        Stations: stations,
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

  async deleteLocation(Id: number, authId: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const location = await this.LocationsRepository.getById(Id);
      if (!location) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Không tìm thấy khu vực";
        return res;
      }
      await this.LocationsRepository.softDelete({ Id });
      const stations = await this.stationsRepository.getAll({
        where: { LocationId: Id }
      });
      
      for (const station of stations) {
        await this.stationsRepository.update(
          { Id: station.Id },
          { DeletedAt: new Date(), DeletedBy: authId }
        );
      }
      const stationIds = stations.map(s => s.Id);
      const devices = await this.DevicesRepository.getAll({
        where: { StationId: In(stationIds) }
      });
      const deviceIds = devices.map(d => d.Id);
      
      for (const device of devices) {
        await this.DevicesRepository.update(
          { Id: device.Id },
          {
            StationId: null,
            Status: 0,
            UpdatedBy: authId,
            UpdatedAt: new Date()
          }
        );
      }
      for (const deviceId of deviceIds) {
        await this.SensorsRepository.update(
          { DeviceId: deviceId },
          {
            Status: 0,
            UpdatedBy: authId,
            UpdatedAt: new Date()
          }
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

  async importFromFile(file: Express.Multer.File) {
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
          const payload: PayloadCreateLocationDto = {
            Name: record.Name,
            CreatedAt: new Date(),
          };

          const entity = Mapper.mapDtoToEntity(payload, LocationsEntity);
          const savedEntity = await this.LocationsRepository.create(entity);

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
}
