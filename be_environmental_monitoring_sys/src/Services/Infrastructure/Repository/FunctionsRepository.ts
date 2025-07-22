import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { FunctionsEntity } from "src/Services/Domain/Models/functions.entity";
import { FunctionsDto } from "src/Services/Domain/Dtos/functions.dto";
import { FunctionsDao } from "../Dao/FunctionsDao";

@Injectable()
export class FunctionsRepository extends CoreRepositoryBase<FunctionsEntity, FunctionsDto> {
    constructor(
        private readonly functionsDao: FunctionsDao
    ) {
        super([functionsDao]);
    }
}