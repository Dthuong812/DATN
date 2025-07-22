import { DaoBase } from "src/common/Infrastructure/Dao/DaoBase";
import { IDaoBase } from "./Interfaces/IDaoBase";

export class CoreDaoBase<TEntity,TDto> extends DaoBase<TEntity,TDto> implements IDaoBase<TEntity, TDto>
{
    constructor(entity: new () => TEntity)
    {
        super(entity,process.env.DATABASE_URL,entity);
    }
}