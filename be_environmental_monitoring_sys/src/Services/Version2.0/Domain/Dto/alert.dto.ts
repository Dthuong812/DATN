export class AlertDto {
    Id?: number;
    Object_Code?: string;
    Object_Name?: string;
    Type?: string; 
    Level?: string; 
    Message?: string;
    Value?: number;
    Unit?: string;
    IsRead?: boolean;
    CreatedAt?: Date;
}