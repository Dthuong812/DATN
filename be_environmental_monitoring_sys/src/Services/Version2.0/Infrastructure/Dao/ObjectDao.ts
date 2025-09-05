import { ObjectDto } from "../../Domain/Dto/object.dto";
import { ObjectEntity } from "../../Domain/Models/object.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class ObjectDao extends CoreDaoBase<ObjectEntity, ObjectDto> {
    constructor() {
      super(ObjectEntity);
    }
}
