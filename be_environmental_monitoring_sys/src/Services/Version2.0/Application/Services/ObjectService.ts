import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { ObjectEntity } from "../../Domain/Models/object.entity";
import { ObjectDto } from "../../Domain/Dto/object.dto";
import { ObjectRepository } from "../../Infrastructure/Repository/ObjectRepository";

@Injectable()
export class ObjectService extends CoreServiceBase<ObjectEntity, ObjectDto> {
    constructor(
        private readonly objectRepository: ObjectRepository
    ){
        super(objectRepository);
    }
}