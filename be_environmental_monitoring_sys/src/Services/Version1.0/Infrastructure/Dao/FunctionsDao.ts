import { FunctionsDto } from "../../Domain/Dtos/functions.dto";
import { FunctionsEntity } from "../../Domain/Models/functions.entity";
import { CoreDaoBase } from "./CoreDaoBase";


export class FunctionsDao extends CoreDaoBase<FunctionsEntity, FunctionsDto> {
    constructor() {
      super(FunctionsEntity);
    }
}