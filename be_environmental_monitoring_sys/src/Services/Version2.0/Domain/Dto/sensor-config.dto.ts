export class SensorConfigDto{
    Id: number;
    Code: string;
    Label: string;
    Unit: string
    Thresholds: number[];
    Colors: string[];
    Descriptions: string[]
    Field: string; 
}