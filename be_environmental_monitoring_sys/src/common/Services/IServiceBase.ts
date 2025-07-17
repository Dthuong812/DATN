import { ResultResponse } from "src/common/ResultResponse"; 

export interface IServiceBase<TEntity,TDto>
{
    count():Promise<number>;
    create(entity: TEntity, authId: number,action:string):Promise<ResultResponse>
    delete(condition: object,authId: number,action:string):Promise<ResultResponse>;
    findAll(params: { page?: number; pageSize?: number; searchString?: string; filter: string[] }):Promise<ResultResponse>
    getAll(options?: any):Promise<ResultResponse>;
    getById(Id:Number):Promise<ResultResponse>;
    getByNameLike(fieldName: keyof TEntity, searchName: string): Promise<ResultResponse>
    getByNameEqual(fieldName: keyof TEntity, searchName: string): Promise<ResultResponse>
    update(condition: object, entity: TEntity,  authId: number,action:string):Promise<ResultResponse>;
    createMany(entities: TEntity[]): Promise<ResultResponse> 
    softDelete(condition: object, authId: number,action:string):Promise<ResultResponse>;
}