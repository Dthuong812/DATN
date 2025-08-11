import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { LogsEntity } from "src/Services/Domain/Models/logs.entity";
import { LogsDto, WriteLogsDto } from "src/Services/Domain/Dtos/logs.dto";
import { LogsRepository } from "src/Services/Infrastructure/Repository/LogsRepository";
import { LogTypeId } from "src/common/EnumLoaiLogs";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";

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
    Action: string,
    method: string,
    message: string,
    data: any,
    authId: number
  ) {
    await this.LogsRepository.writeLogs({
      LogTypeId: LogTypeId,
      Action:  Action,
      Method: method,
      Content: message,
      Data: JSON.stringify(data),
      CreatedBy: authId,
      CreatedAt: new Date()
    });
  }
  async getAllLogs(): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const logs = await this.LogsRepository.getAll();
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lí thành công";
      res.Data = logs;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
}