import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("SensorData",{schema: "eco_monitoring"})
export class SensorDataEntity { 
    @PrimaryGeneratedColumn({ type: 'int', name: 'Id' })    
    Id: number;
    @Column({ type: 'int' })
    SensorId: number;
    @Column({ type: 'float' })
    Value: number;
    @Column("datetime",{ nullable: true })
    Recorded_At: Date;
}