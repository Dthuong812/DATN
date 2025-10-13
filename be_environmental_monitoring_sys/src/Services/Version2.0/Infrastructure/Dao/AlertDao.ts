import { AlertDto } from "../../Domain/Dto/alert.dto";
import { AlertEntity } from "../../Domain/Models/alert.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class AlertDao extends CoreDaoBase<AlertEntity, AlertDto> {
    constructor() {
      super(AlertEntity);
    }
}