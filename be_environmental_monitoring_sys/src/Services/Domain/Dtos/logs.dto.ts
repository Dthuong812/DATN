export class LogsDto{
    Id: number;
    LogTypeId: number;
    Action: string;
    Method: string;
    Content: string;
    Data: string;
    CreatedAt: Date;
    CreatedBy: number;
}