import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { FunctionsEntity } from "src/Services/Domain/Models/functions.entity";
import { FunctionsDto } from "src/Services/Domain/Dtos/functions.dto";
import { FunctionsRepository } from "src/Services/Infrastructure/Repository/FunctionsRepository";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";

@Injectable()
export class FunctionsService extends CoreServiceBase<
  FunctionsEntity,
  FunctionsDto
> {
  constructor(private readonly functionsRepository: FunctionsRepository) {
    super(functionsRepository);
  }

  async getAllFunction(): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
        const functions = await this.functionsRepository.getAll();
        res.Status = ErrorCode.SUCCESS;
        res.Message = "Xử lí thành công";
        res.Data = functions;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
}
