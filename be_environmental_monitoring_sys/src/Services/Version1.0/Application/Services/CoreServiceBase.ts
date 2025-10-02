import { ServiceBase } from "src/common/Services/ServiceBase";
import { IServiceBase } from "../Interfaces/IServiceBase";

export class CoreServiceBase<TEntity, TDto>
  extends ServiceBase<TEntity, TDto>
  implements IServiceBase<TEntity, TDto> {}
