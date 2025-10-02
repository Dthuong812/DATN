import { LogsDto } from "../../Domain/Dtos/logs.dto";
import { LogsEntity } from "../../Domain/Models/logs.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class LogsDao extends CoreDaoBase<LogsEntity, LogsDto> {
    constructor() {
      super(LogsEntity);
    }
    
}