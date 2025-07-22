import { FunctionsEntity } from "src/Services/Domain/Models/functions.entity";
import { CoreDaoBase } from "./CoreDaoBase";
import { FunctionsDto } from "src/Services/Domain/Dtos/functions.dto";


export class FunctionsDao extends CoreDaoBase<FunctionsEntity, FunctionsDto> {
    constructor() {
      super(FunctionsEntity);
    }
}