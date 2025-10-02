import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from "@nestjs/common";
  import { LogTypeId, Action, Method } from "src/common/EnumLoaiLogs";
  import { LogsService } from "src/Services/Version1.0/Application/Services/LogsService";
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly logsService: LogsService,
      private readonly serviceName: string
    ) {}
  
    async catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const request = ctx.getRequest<Request>();
      const response = ctx.getResponse();
  
      let status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
  
      let errorMessage: any = "Internal server error";
  
      if (exception instanceof HttpException) {
        const exceptionResponse = exception.getResponse();
  
        if (typeof exceptionResponse === "string") {
          errorMessage = exceptionResponse;
        } else if (
          typeof exceptionResponse === "object" &&
          exceptionResponse !== null
        ) {
          if ("message" in exceptionResponse) {
            errorMessage = exceptionResponse["message"];
          } else {
            errorMessage = exceptionResponse;
          }
        } else {
          errorMessage = exception.message;
        }
      } else if (exception instanceof Error) {
        errorMessage = exception.message;
      }
  
      const actionMap: Record<string, Action> = {
        GET: Action.READ,
        POST: Action.CREATE,
        PATCH: Action.UPDATE,
        PUT: Action.UPDATE,
        DELETE: Action.DELETE,
      };
      const action = actionMap[request.method] || Action.READ;
  
      this.logsService.sendLog(
        LogTypeId.Loi_He_Thong,
        this.serviceName,
        action,
        request.method as Method,
        typeof errorMessage === "string"
          ? errorMessage
          : JSON.stringify(errorMessage),
        { stack: (exception as any)?.stack },
        request["user"]?.sub
      );
  
      response.status(status).json({
        Status: status,
        error: errorMessage,
      });
    }
  }
  