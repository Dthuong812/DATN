import { DepartmentDto } from "../../Domain/Dto/department.dto";
import { DepartmentEntity } from "../../Domain/Models/department.entity";
import { CoreDaoBase } from "./CoreDaoBase";

export class DepartmentDao extends CoreDaoBase<DepartmentEntity, DepartmentDto> {
    constructor() {
      super(DepartmentEntity);
    }
}