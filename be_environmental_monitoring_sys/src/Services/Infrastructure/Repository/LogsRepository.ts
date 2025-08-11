import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { LogsEntity } from "src/Services/Domain/Models/logs.entity";
import { LogsDto, WriteLogsDto } from "src/Services/Domain/Dtos/logs.dto";
import { LogsDao } from "../Dao/LogsDao";

@Injectable()
export class LogsRepository extends CoreRepositoryBase<LogsEntity, LogsDto> {
  constructor(private readonly LogsDao: LogsDao) {
    super([LogsDao]);
  }
async writeLogs(dto: WriteLogsDto) {
    const entity = new LogsEntity();
    Object.assign(entity, dto);
    entity.CreatedAt = dto.CreatedAt || new Date(); 

    return this.LogsDao.create(entity);
  }
}
