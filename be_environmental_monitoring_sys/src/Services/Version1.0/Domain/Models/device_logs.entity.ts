import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("DeviceLogs", { schema: "eco_monitoring" })
export class DeviceLogsEntity {
    @PrimaryGeneratedColumn({ type: "int" })
    Id?: number;
    
    @Column("int", { nullable: false })
    DeviceId?: number;

    @Column("int", { nullable: true })
    Status?: number;

    @Column("datetime", { nullable: false })
    LogTime?: Date;
    
    @Column("varchar", { length: 255, nullable: true })
    Message?: string;

    @Column("datetime", { nullable: true })
    DeletedAt?: Date;
}