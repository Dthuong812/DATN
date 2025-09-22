import {
    Injectable,
    ArgumentMetadata,
    BadRequestException,
    ValidationPipe,
    ExecutionContext,
  } from "@nestjs/common";
  import { LogTypeId, Action, Method } from "src/common/EnumLoaiLogs";
import { LogsService } from "src/Services/Version1.0/Application/Services/LogsService";

  
  @Injectable()
  export class ValidationLoggingPipe extends ValidationPipe {
    constructor(private readonly logsService: LogsService,
      private readonly serviceName: string
    ) {
      super({ whitelist: true, forbidNonWhitelisted: true });
    }
  
    async transformWithContext(value: any, metadata: ArgumentMetadata, context: ExecutionContext) {
        try {
          return await super.transform(value, metadata);
        } catch (err) {
          const request = context.switchToHttp().getRequest<Request>();
          const actionMap: Record<string, Action> = {
            GET: Action.READ,
            POST: Action.CREATE,
            PATCH: Action.UPDATE,
            PUT: Action.UPDATE,
            DELETE: Action.DELETE,
          };
          const action = actionMap[request.method] || Action.READ;
          this.logsService.sendLog(
            LogTypeId.Loi_Nguoi_Dung_Nhap_Lieu,
            this.serviceName,
            action,
            request.method as Method,
            "Dữ liệu nhập không hợp lệ",
            { errors: err?.response?.message, payload: value },
            request?.["user"]?.sub || 0
          );
      
          throw err; 
        }
      }
  }
  