import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from "@nestjs/common";
  import { Observable } from "rxjs";
  import { tap } from "rxjs/operators";
  import { LogTypeId, Action, Method } from "src/common/EnumLoaiLogs";
  import { LogsService } from "src/Services/Application/Services/LogsService";
  
  @Injectable()
  export class RequestLoggingInterceptor implements NestInterceptor {
    constructor(private readonly logsService: LogsService) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest<Request>();
  
      const actionMap: Record<string, Action> = {
        GET: Action.READ,
        POST: Action.CREATE,
        PATCH: Action.UPDATE,
        PUT: Action.UPDATE,
        DELETE: Action.DELETE,
      };
      const action = actionMap[request.method] || Action.READ;
        // Ghi log khi nhận request từ client
      this.logsService.sendLog(
        LogTypeId.REQUEST_TO_APP,
        action,
        request.method as Method,
        "Nhận request từ client",
        {
          url: request.url,
          body: request.body,
        },
        request["user"]?.sub || 0
      );
  
      return next.handle().pipe(
        tap((data) => {
          // Có thể log Xu_Ly_Thanh_Cong ở đây nếu cần
        })
      );
    }
  }
  