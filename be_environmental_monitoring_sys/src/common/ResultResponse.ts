import { ErrorCode } from "./ErrorCode/EnumCode";

export class ResultResponse{
    Status: number;
    Message: string;
    Data: any ;
    constructor(status: number=0, message: string='', data: any=null)
    {
        this.Status=status;
        this.Message=message;
        this.Data=data;
    }
   
}
export class Result_Response<TEntity> {
    Status: number;
    Message: string;
    Data:
    {
        items: TEntity[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    } ;

   constructor(
        status: number = ErrorCode.EXCEPTION,
        message: string = '',
        items: TEntity[] = [],
        totalItems: number = 0,
        totalPages: number = 0,
        currentPage: number = 1,
        pageSize: number = 10
    ) {
        this.Status = status;
        this.Message = message;
        this.Data = {
            items,
            totalItems,
            totalPages,
            currentPage,
            pageSize
        };
    }
}