import { DaoBase } from "src/common/Infrastructure/Dao/DaoBase";
import { IDaoBase } from "src/common/Infrastructure/Dao/Interfaces/IDaoBase";

export class CoreDaoBase<TEntity,TDto> extends DaoBase<TEntity,TDto> implements IDaoBase<TEntity, TDto>
{
    constructor(entity: new () => TEntity)
    {
        super(entity,process.env.DATABASE_URL_VER_2,entity);
    }
}