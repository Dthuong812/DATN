import { Delete } from '@nestjs/common';
export class SensorsDataDto {
    Id: number;
    SensorId: number;
    Value: number;
    Recorded_At: Date;
}