export interface IDaoBase<TEntity, TDto>
{
    create(entity: TEntity):Promise<TEntity>
    update(condition: object, entity: Partial<TEntity>):Promise<TEntity>;
    delete(condition:object):Promise<number>;
    getAll(options?: any):Promise<TEntity[]>;
    getById(Id:Number,relations: string[]):Promise<TEntity>;
    count():Promise<number>;
    findAll(searchname:string):Promise<TEntity[]>;
    getByNameLike(fieldName: keyof TEntity, searchName: string): Promise<TEntity[]>
    getByNameEqual(fieldName: keyof TEntity, searchName: string): Promise<TEntity[]>
    createMany(entities: TEntity[]): Promise<TEntity[]>
    softDelete(condition: object): Promise<number>
}