import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { ObjectEntity } from "../../Domain/Models/object.entity";
import { FilterObjectDto, ObjectDto } from "../../Domain/Dto/object.dto";
import { ObjectRepository } from "../../Infrastructure/Repository/ObjectRepository";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { ResultResponse } from "src/common/ResultResponse";
import { Like } from "typeorm";

@Injectable()
export class ObjectService extends CoreServiceBase<ObjectEntity, ObjectDto> {
  constructor(private readonly objectRepository: ObjectRepository) {
    super(objectRepository);
  }
  async getAll(filter: FilterObjectDto): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const where: any = {};
      if (filter.Project_Code)
        where.Project_Code = Like(`%${filter.Project_Code}%`);
      if (filter.Name)
        where.Name = Like(`%${filter.Name}%`);
      if (filter.Organization_Code)
        where.Organization_Code = Like(`%${filter.Organization_Code}%`);
      if (filter.Status) where.Status = Like(`%${filter.Status}%`);
      if (filter.Address) where.Details_Value = Like(`%${filter.Address}%`);
      if (filter.Installation_Date)
        where.Details_Value = Like(`%${filter.Installation_Date}%`);
      if (filter.Connection_Type)
        where.Details_Value = Like(`%${filter.Connection_Type}%`);
      if (filter.Last_Maintenance_Date)
        where.Details_Value = Like(`%${filter.Last_Maintenance_Date}%`);


      const page = Number(filter.page ?? 1);
      const pageSize = Number(filter.pageSize ?? 10);
      const skip = (page - 1) * pageSize;
      const take = pageSize;

      const object = await this.objectRepository.getAll({ where, skip, take,order: { CreatedAt: "DESC" } });
      const total = await this.objectRepository.getAll(where);
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Lấy dữ liệu thành công";
      res.Data = {
        data: object,
        total: total.length,
        page: page,
        pageSize: pageSize,
      };
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = "Lỗi hệ thống";
    }
    return res;
  }

}
