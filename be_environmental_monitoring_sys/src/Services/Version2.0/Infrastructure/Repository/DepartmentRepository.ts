import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { DepartmentEntity } from "../../Domain/Models/department.entity";
import { DepartmentDto } from "../../Domain/Dto/department.dto";
import { DepartmentDao } from "../Dao/DepartmentDao";

@Injectable()
export class DepartmentRepository extends CoreRepositoryBase<DepartmentEntity, DepartmentDto> {
    constructor(
        private readonly DepartmentDao: DepartmentDao
    ) {
        super([DepartmentDao]);
    }
}