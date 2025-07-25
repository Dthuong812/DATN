import { Result_Response, ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { ErrorManage } from "src/common/ErrorCode/ErrorManager";
import { OrderBy, SelectOption } from "src/common/Util";
import { IServiceBase } from "./IServiceBase";
import { RepositoryBase } from "../Infrastructure/Repository/RepositoryBase";
import { IPaginationOptions } from "../Infrastructure/Dao/Interfaces/IPaginationOptions";
import { IPaginationResult } from "../Infrastructure/Dao/Interfaces/IPaginationResult";
import { plainToInstance } from "class-transformer";
export class ServiceBase<TEntity, TDto> implements IServiceBase<TEntity, TDto> {
  protected _repository: RepositoryBase<TEntity, TDto>;
  constructor(repository: RepositoryBase<TEntity, TDto>) {
    this._repository = repository;
  }
  async count(): Promise<number> {
    return await this._repository.count();
  }
  async createMany(entities: TEntity[]): Promise<ResultResponse> {
    const item = await this._repository.createMany(entities);
    const res = new ResultResponse(0, "", null);
    if (item) {
      res.Status = ErrorCode.SAVE_SUCCESS;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.SAVE_SUCCESS);
      res.Data = item;
    } else {
      res.Status = ErrorCode.SAVE_FAIL;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.SAVE_FAIL);
      res.Data = item;
    }
    return res;
  }
  async create(
    entity: TEntity
  ): Promise<ResultResponse> {
    const item = await this._repository.create(entity);

    const res = new ResultResponse(0, "", null);
    if (item) {
      res.Status = ErrorCode.SAVE_SUCCESS;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.SAVE_SUCCESS);
      res.Data = item;
    } else {
      res.Status = ErrorCode.SAVE_FAIL;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.SAVE_FAIL);
      res.Data = item;
    }
    return res;
  }
  async delete(
    condition: object
  ): Promise<ResultResponse> {
    const item = await this._repository.delete(condition);
    const res = new ResultResponse(0, "", null);

    if (item) {
      res.Status = ErrorCode.DELETE_SUCCESS;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.DELETE_SUCCESS);
    } else {
      res.Status = ErrorCode.DELETE_FAIL;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.DELETE_FAIL);
    }
    return res;
  }
  async findAll(params: {
    page?: number;
    pageSize?: number;
    searchString?: string;
    filter?: string[];
    relations?: string[];
    select?: SelectOption<TEntity>;
    OrderBy?: OrderBy<TEntity>;
  }): Promise<ResultResponse> {
    const items = await this._repository.findAll(params);
    const res = new ResultResponse(0, "", null);
    if (items) {
      res.Status = ErrorCode.SUCCESS;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.SUCCESS);
      res.Data = items;
    }
    return res;
  }
  async getById(Id: Number, relations: string[] = []): Promise<ResultResponse> {
    const res = new ResultResponse(0, "", null);
     if (Id === null || Id === undefined) {
    res.Status=ErrorCode.EXCEPTION;
    res.Message="Id không hợp lệ";
    return res;
  }
    const item = await this._repository.getById(Id, relations);
    if (item) {
      res.Status = ErrorCode.SUCCESS;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.SUCCESS);
      res.Data = item;
    }

    return res;
  }
  async getByNameLike(
    fieldName: keyof TEntity,
    searchName: string
  ): Promise<ResultResponse> {
    const items = await this._repository.getByNameLike(fieldName, searchName);
    const res = new ResultResponse(0, "", null);
    if (items && items.length > 0) {
      res.Status = ErrorCode.SUCCESS;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.SUCCESS);
      res.Data = items;
    }
    return res;
  }
  async getByNameEqual(
    fieldName: keyof TEntity,
    searchName: any,
    SelectField?: string[]
  ): Promise<ResultResponse> {
    const items = await this._repository.getByNameEqual(
      fieldName,
      searchName,
      SelectField
    );
    const res = new ResultResponse(0, "", null);
    if (items && items.length > 0) {
      res.Status = ErrorCode.SUCCESS;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.SUCCESS);
      res.Data = items;
    }
    return res;
  }
  async getAll(options?: any): Promise<ResultResponse> {
    const item = await this._repository.getAll(options);
    const res = new ResultResponse(0, "", null);
    if (item) {
      res.Status = ErrorCode.SUCCESS;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.SUCCESS);
      res.Data = item;
    }
    return res;
  }
   async getAllHavePage(options: IPaginationOptions<TEntity> = {}): Promise<Result_Response<TEntity>> {
     const res = new Result_Response<IPaginationResult<TEntity>>();
     return await this._repository.getAllHavePage(options);
    }
  async getAllReturnEntity(options?: any): Promise<TEntity[]> {
    const item = await this._repository.getAll(options);
    if (item && item.length>0) {
      return item;
    }
    return [];
  }
  async update(
    condition: {Id: number},
    entity: TEntity,
  ): Promise<ResultResponse> {
    const findOne = await this._repository.getById(condition.Id);

    const res = new ResultResponse(0, "", null);

    if (!findOne) {
      res.Status = ErrorCode.NOT_FOUND_ID;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.NOT_FOUND_ID);      
      return res;
    }

    const item = await this._repository.update(
      condition,
      entity
    );
    if (item) {
      res.Status = ErrorCode.EDIT_SUCCESS;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.EDIT_SUCCESS);
      res.Data = item;
    } else {
      res.Status = ErrorCode.EDIT_FAIL;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.EDIT_FAIL);
      res.Data = item;
    }
    return res;
  }

  async softDelete(
    condition: {Id: number}
  ): Promise<ResultResponse> {
    const res = new ResultResponse(0, "", null);

    const findOne = await this._repository.getById(condition.Id);
    if (!findOne) {
      res.Status = ErrorCode.NOT_FOUND_ID;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.NOT_FOUND_ID);      
      return res;
    }

    const item = await this._repository.softDelete(
      condition
    );
    if (item) {
      res.Status = ErrorCode.DELETE_SUCCESS;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.DELETE_SUCCESS);
      res.Data = item;
    } else {
      res.Status = ErrorCode.DELETE_FAIL;
      res.Message = ErrorManage.getErrorMessage(ErrorCode.DELETE_FAIL);
      res.Data = item;
    }
    return res;
  }
}
