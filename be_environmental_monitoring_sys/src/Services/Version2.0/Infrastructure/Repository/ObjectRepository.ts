import { Injectable } from "@nestjs/common";
import { RepositoryBase } from "src/common/Infrastructure/Repository/RepositoryBase";
import { ObjectEntity } from "../../Domain/Models/object.entity";
import { ObjectDto } from "../../Domain/Dto/object.dto";
import { ObjectDao } from "../Dao/ObjectDao";

@Injectable()
export class ObjectRepository extends RepositoryBase<ObjectEntity,ObjectDto>{
    constructor(
        private readonly ObjectDao: ObjectDao
    )
    {
        super([ObjectDao])
    }
}