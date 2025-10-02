import { ServiceBase } from "src/common/Services/ServiceBase";
import { IServiceBase } from "../Interface/IServiceBase";

export class CoreServiceBase<TEntity, TDto>
  extends ServiceBase<TEntity, TDto>
  implements IServiceBase<TEntity, TDto> {}
