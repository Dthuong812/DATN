import { Injectable } from "@nestjs/common";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { ResultResponse } from "src/common/ResultResponse";
import { DeleteMultipleStationsDto, PayLoadCreateStationDto, PayLoadUpdateStationDto } from "src/Services/Domain/Dtos/stations.dto";
import { Mapper } from "src/Services/Domain/Mapper/Mapper";
import { StationsEntity } from "src/Services/Domain/Models/stations.entity";
import { StationsRepository } from "src/Services/Infrastructure/Repository/StationsRepository";
import { UserService } from "./UserService";
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import * as path from 'path';
import { In } from "typeorm";
import { LocationsRepository } from "src/Services/Infrastructure/Repository/LocationsRepository";

@Injectable()
export class StationsService {
    constructor(
        private readonly stationsRepository: StationsRepository,
        private readonly userService: UserService, 
        private readonly LocationsRepository: LocationsRepository
    )
    {}
    async importFromFile(file: Express.Multer.File ,authId: number) {
        const ext = path.extname(file.originalname).toLowerCase();
        let rawData: any[] = [];
      
        try {
          if (ext === '.xlsx' || ext === '.csv') {
            const workbook = XLSX.readFile(file.path);
            const sheetName = workbook.SheetNames[0];
            rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          } else if (ext === '.json') {
            const content = fs.readFileSync(file.path, 'utf-8');
            rawData = JSON.parse(content);
          } else {
            throw new Error('Chỉ hỗ trợ file Excel (.xlsx), CSV (.csv), hoặc JSON (.json)');
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
            imported: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
            results,
          };
        } catch (err) {
          return { success: false, message: err.message };
        }
      }
      

    async createStation(payload: PayLoadCreateStationDto, authId:number): Promise<ResultResponse> {
        const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
        try {
            if (!payload) {
                res.Status = ErrorCode.SAVE_FAIL;
                res.Message = "Thông tin không hợp lệ";
                return res;
            }
    
            const stationList = await this.stationsRepository.getAll();
    
            // Kiểm tra trạm trùng tên hoặc trùng tất cả thông tin
            const exists = stationList.find(
                (station) =>
                    station.Name === payload.Name ||
                    (
                        station.Name === payload.Name &&
                        station.Address === payload.Address &&
                        station.LocationId === payload.LocationId &&
                        station.Lat === payload.Lat &&
                        station.Lng === payload.Lng
                    )
            );
            if (exists) {
                res.Status = ErrorCode.SAVE_FAIL;
                res.Message = "Trạm đã tồn tại";
                return res;
            }
    
            payload.CreatedAt = new Date();
            payload.CreatedBy = authId;
            const createdStation = await this.stationsRepository.create( Mapper.mapDtoToEntity(payload, StationsEntity));
    
            res.Status = ErrorCode.SUCCESS;
            res.Message = "Tạo thành công";
            res.Data = createdStation;
        } catch (error) {
            res.Status = ErrorCode.EXCEPTION;
            res.Message = error.message;
        }
        return res;
    }

    async updateStation(Id: number, payload: PayLoadUpdateStationDto ,authId:number): Promise<ResultResponse> {
        const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
        try {
            if (!payload) {
                res.Status = ErrorCode.SAVE_FAIL;
                res.Message = "Thông tin không hợp lệ";
                return res;
            }

            const station = await this.stationsRepository.getById(Id);
            if (!station) {
                res.Status = ErrorCode.EDIT_FAIL;
                res.Message = "Trạm không tồn tại";
                return res;
            }

            // Kiểm tra trạm trùng
            const stationList = await this.stationsRepository.getAll();
            const exists = stationList.find(
                (s) =>
                    s.Id !== Id && (
                        s.Name === payload.Name ||
                        (
                            s.Name === payload.Name &&
                            s.Address === payload.Address &&
                            s.LocationId === payload.LocationId &&
                            s.Lat === payload.Lat &&
                            s.Lng === payload.Lng
                        )
                    )
            );
            if (exists) {
                res.Status = ErrorCode.SAVE_FAIL;
                res.Message = "Trạm đã tồn tại";
                return res;
            }
            payload.UpdatedAt = new Date();
            payload.UpdatedBy = authId;

            const updatedStation = await this.stationsRepository.update({Id}, Mapper.mapDtoToEntity(payload, StationsEntity) );

            res.Status = ErrorCode.SUCCESS;
            res.Message = "Cập nhật thành công";
            res.Data = updatedStation;
        } catch (error) {
            res.Status = ErrorCode.EXCEPTION;
            res.Message = error.message;
        }
        return res;
    }
    async deleteStation(Id: number, authId:number): Promise<ResultResponse> {
        const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
        try {
            const station = await this.stationsRepository.getById(Id);
            if (!station) {
                res.Status = ErrorCode.NOT_FOUND_ID;
                res.Message = "Không tìm thấy trạm";
                return res;
            }
            station.DeletedAt = new Date();
            station.DeletedBy = authId;
            await this.stationsRepository.update({Id}, station);
            await this.stationsRepository.softDelete({Id});
            res.Status = ErrorCode.SUCCESS;
            res.Message = "Xóa thành công";
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
            if (!stations || stations.length === 0) {
                res.Status = ErrorCode.EXCEPTION;
                res.Message = "Không có trạm nào";
                return res;
            }
            const listUser = await this.userService.getAll();
            const userData = listUser.Data

            stations.forEach(station => {
                const createdByUser = userData.find(user => user.Id === station.CreatedBy);
                if (createdByUser) {
                    station.CreatedBy = createdByUser.UserName;
                }
                const updatedByUser = userData.find(user => user.Id === station.UpdatedBy);
                if (updatedByUser) {
                    station.UpdatedBy = updatedByUser.UserName;
                }
            }); 
            const LocationList = await this.LocationsRepository.getAll();
            const locationMap = new Map(LocationList.map(loc => [loc.Id, loc.Name]));
            const result = stations.map(station => ({
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
                Status: station.Status
            }))       
            res.Status = ErrorCode.SUCCESS;
            res.Message = "Xử lí thành công";
            res.Data = result;
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
            const locationMap = new Map(LocationList.map(loc => [loc.Id, loc.Name]));
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
                Status: station.Status
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
}