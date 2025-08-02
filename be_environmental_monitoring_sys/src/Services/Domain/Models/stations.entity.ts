import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Stations", { schema: "eco_monitoring" })
export class StationsEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    Id: number;
    @Column("varchar", { length: 150, nullable: true })
    Name: string;
    @Column("varchar", { length: 255, nullable: true })
    Address: string;
    @Column("int", { nullable: true })
    LocationId: number;
    @Column({ type: 'decimal', precision: 10, scale: 8 })
    Lat: number;
    @Column({ type: 'decimal', precision: 10, scale: 8 })
    Lng: number;
    @Column("datetime", { nullable: true })
    CreatedAt: Date;
    @Column("datetime", { nullable: true })
    UpdatedAt: Date;
    @Column("int", { nullable: true })
    CreatedBy: number;
    @Column("int", { nullable: true })
    UpdatedBy: number;
    @DeleteDateColumn()
    DeletedAt?: Date
    @Column("int", { nullable: true })
    DeletedBy: number;
    @Column("int", { nullable: true })
    Status: number;
}