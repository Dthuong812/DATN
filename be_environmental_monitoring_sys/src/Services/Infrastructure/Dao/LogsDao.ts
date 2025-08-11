import { LogsDto } from "src/Services/Domain/Dtos/logs.dto";
import { LogsEntity } from "src/Services/Domain/Models/logs.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class LogsDao extends CoreDaoBase<LogsEntity, LogsDto> {
    constructor() {
      super(LogsEntity);
    }
    
}