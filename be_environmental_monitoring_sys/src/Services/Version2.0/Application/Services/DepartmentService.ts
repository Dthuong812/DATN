import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { DepartmentEntity } from "../../Domain/Models/department.entity";
import { DepartmentDto } from "../../Domain/Dto/department.dto";
import { DepartmentRepository } from "../../Infrastructure/Repository/DepartmentRepository";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";

@Injectable()
export class DepartmentService extends CoreServiceBase<
  DepartmentEntity,
  DepartmentDto
> {
  constructor(private readonly DepartmentRepository: DepartmentRepository) {
    super(DepartmentRepository);
  }

  async deleteDepartment(Id: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const department = await this.DepartmentRepository.getById(Id);
      if (!department) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Phòng ban không tồn tại";
        return res;
      }
      await this.DepartmentRepository.softDelete({Parent_Id: Id});
      await this.DepartmentRepository.softDelete({ Id });
      res.Status = ErrorCode.DELETE_SUCCESS;
      res.Message = "Xóa thành công";
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
}
