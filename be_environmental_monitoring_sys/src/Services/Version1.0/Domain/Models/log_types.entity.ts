import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("LogTypes", { schema: "eco_monitoring" })
export class LogTypesEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
    Id: number;
    @Column({ type: 'varchar', length: 250 })
    Name: string;
}