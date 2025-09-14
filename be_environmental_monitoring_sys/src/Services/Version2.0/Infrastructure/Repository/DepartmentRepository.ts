import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { DepartmentEntity } from "../../Domain/Models/department.entity";
import { DepartmentDto, PayloadFilterDepartmentDto } from "../../Domain/Dto/department.dto";
import { DepartmentDao } from "../Dao/DepartmentDao";

@Injectable()
export class DepartmentRepository extends CoreRepositoryBase<DepartmentEntity, DepartmentDto> {
    constructor(
        private readonly DepartmentDao: DepartmentDao
    ) {
        super([DepartmentDao]);
    }
    async filter(params: PayloadFilterDepartmentDto, relations?: string[]): Promise<any>{
        try {
          const page = typeof params.page === 'string' ? parseInt(params.page) : params.page || 1;
          const pageSize = typeof params.pageSize === 'string' ? parseInt(params.pageSize) : params.pageSize || 10;
          const skip = (page - 1) * pageSize;
          const take = pageSize;
          const sortOrder = params.sortOrder || 'DESC'
          const sortField = params.sortField || 'Id'
          let where: any = {}
          let order = {[sortField]: sortOrder}

          if(params.Organization_Id)
            where.Organization_Id = params.Organization_Id
  
          const [data, total] = await this.DepartmentDao._repository.findAndCount({
            where,
            skip,
            take,
            order,
            relations
          })
  
          return {
            data,
            total,
            page,
            pageSize
          }
        } catch (error) {
          throw new Error('Unable to fetch data');
        }
       
      }
}