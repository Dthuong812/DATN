import { RepositoryBase } from "src/common/Infrastructure/Repository/RepositoryBase";
import { IRepositoryBase } from "./Interfaces/IRepositoryBase";

export class CoreRepositoryBase<TEntity, TDto>
  extends RepositoryBase<TEntity, TDto>
  implements IRepositoryBase<TEntity, TDto> {}
