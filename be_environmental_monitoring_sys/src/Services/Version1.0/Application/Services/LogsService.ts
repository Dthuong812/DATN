import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { LogsEntity } from "../../Domain/Models/logs.entity";
import { FilterLogsDto, LogsDto } from "../../Domain/Dtos/logs.dto";
import { LogsRepository } from "../../Infrastructure/Repository/LogsRepository";
import { Between, LessThanOrEqual, Like, MoreThanOrEqual } from "typeorm";
import { LogTypeId } from "src/common/EnumLoaiLogs";

@Injectable()
export class LogsService extends CoreServiceBase<
  LogsEntity,
  LogsDto
> {
  constructor(
    private readonly LogsRepository: LogsRepository,
  ) {
    super(LogsRepository);
  }
  async sendLog(
    LogTypeId: number,
    Service: string = 'Tên Class',
    Action: string,
    method: string,
    message: string,
    data: any,
    authId: number
  ) {
    await this.LogsRepository.writeLogs({
      LogTypeId: LogTypeId,
      Service: Service,
      Action:  Action,
      Method: method,
      Content: message,
      Data: JSON.stringify(data),
      CreatedBy: authId,
      CreatedAt: new Date()
    });
  }
  async getAllLogs(filter: FilterLogsDto): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const where: any = {};

      if (filter.LogTypeId) where.LogTypeId = Like(`%${filter.LogTypeId}%`);
      if (filter.Service) where.Service = Like(`%${filter.Service}%`);
      if (filter.Method) where.Method = Like(`%${filter.Method}%`);
      if (filter.Action) where.Action = Like(`%${filter.Action}%`);
      if (filter.startDate && filter.endDate) {
        where.CreatedAt = Between(new Date(filter.startDate), new Date(filter.endDate));
      } else if (filter.startDate) {
        where.CreatedAt = MoreThanOrEqual(new Date(filter.startDate));
      } else if (filter.endDate) {
        where.CreatedAt = LessThanOrEqual(new Date(filter.endDate));
      }
      const page = Number(filter.page ?? 1);
      const pageSize = Number(filter.pageSize ?? 10);
      const skip = (page - 1) * pageSize;
      const take = pageSize;

      const logs = await this.LogsRepository.getAll({
        where,
        skip,
        take,
        order: {
          CreatedAt: "DESC", 
        },
      });

      const total = await this.LogsRepository.getAll({
        where,
      });

      const logsWithLogTypeName = logs.map((log) => ({
        ...log,
        LogTypeName: LogTypeId[log.LogTypeId], 
      }));

      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lý thành công";
      res.Data = {
        items: logsWithLogTypeName,
        total: total.length,
        page: page,
        pageSize: pageSize,
      };
    } catch (error) {
      res.Message = error.message;
    }
    return res;
  }
}