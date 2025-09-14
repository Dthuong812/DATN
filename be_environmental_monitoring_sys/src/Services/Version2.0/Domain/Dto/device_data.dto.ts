export class DeviceDataDto {
    Id?: number;
    Device_Code?: string;
    Project_Code?: string;
    Object_Code?: string;
    DataJson?: Record<string, any>;
    Times?: Date;
    Speed?: number;
    DataType?: number;
    Latitude?: number;
    Longitude?: number;
}