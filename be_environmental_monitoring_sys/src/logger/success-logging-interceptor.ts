import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

import { LogTypeId, Action, Method } from "src/common/EnumLoaiLogs";
import { LogsService } from "src/Services/Version1.0/Application/Services/LogsService";


@Injectable()
export class SuccessLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logsService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      tap((data) => {
        const actionMap: Record<string, Action> = {
          GET: Action.READ,
          POST: Action.CREATE,
          PATCH: Action.UPDATE,
          PUT: Action.UPDATE,
          DELETE: Action.DELETE,
        };
        const action = actionMap[request.method] || Action.READ;

        // Lấy message từ data nếu có
        const message =
          data && typeof data === "object" && "Message" in data
            ? (data as any).Message
            : "Success";

        this.logsService.sendLog(
          LogTypeId.Xu_Ly_Thanh_Cong,
          action,
          request.method as Method,
          message,
          data,
          request["user"]?.sub || 0
        );
      })
    );
  }
}
