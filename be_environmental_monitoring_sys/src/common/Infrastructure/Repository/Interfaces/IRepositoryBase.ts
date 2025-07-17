import { SelectQueryBuilder } from "typeorm";

export interface IRepsitoryBase<TEntity,TDto> 
{
  count():Promise<number>;
  create(entity: TEntity):Promise<TEntity>
  delete(condition:object):Promise<number>;
  findAll(params: {page?: number;pageSize?: number;searchString?: string; filter:string[]}):Promise<any>;
  getAll(options?: any):Promise<TEntity[]>;
  getById(Id:Number,relations: string[]):Promise<TEntity>;
  getByNameLike(fieldName: keyof TEntity, searchName: string): Promise<TEntity[]>
  getByNameEqual(fieldName: keyof TEntity, searchName: string): Promise<TEntity[]>
  update(condition: object, entity: TEntity):Promise<TEntity>;
  createMany(entities: TEntity[]): Promise<TEntity[]>;
  softDelete(condition: object):Promise<number>;
}