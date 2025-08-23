import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { FunctionsDao } from "../Dao/FunctionsDao";
import { FunctionsEntity } from "../../Domain/Models/functions.entity";
import { FunctionsDto } from "../../Domain/Dtos/functions.dto";

@Injectable()
export class FunctionsRepository extends CoreRepositoryBase<FunctionsEntity, FunctionsDto> {
    constructor(
        private readonly functionsDao: FunctionsDao
    ) {
        super([functionsDao]);
    }
}