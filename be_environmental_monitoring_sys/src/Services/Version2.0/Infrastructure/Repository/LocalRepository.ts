import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { LocalEntity } from "../../Domain/Models/local.entity";
import { LocalDto } from "../../Domain/Dto/local.dto";
import { LocalDao } from "../Dao/LocalDao";

@Injectable()
export class LocalRepository extends CoreRepositoryBase<LocalEntity, LocalDto> {
    constructor(
        private readonly LocalDao: LocalDao
    ) {
        super([LocalDao]);
    }
}