import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Stations", { schema: "eco_monitor" })
export class Stations {
    @PrimaryGeneratedColumn({ type: 'int' })
    Id: number;
    @Column("varchar", { length: 150, nullable: true })
    Name: string;
    @Column("varchar", { length: 255, nullable: true })
    Address: string;
    @Column("int", { nullable: true })
    LocationId: number;
    @Column("int", { nullable: true })
    Lat: number;
    @Column("int", { nullable: true })
    Lng: number;
    @Column("datetime", { nullable: true })
    CreatedAt: Date;
    @Column("datetime", { nullable: true })
    UpdatedAt: Date;
    @Column("int", { nullable: true })
    CreatedBy: number;
    @Column("int", { nullable: true })
    UpdatedBy: number;
    @Column("datetime", { nullable: true })
    DeletedAt: Date;
    @Column("int", { nullable: true })
    DeletedBy: number;
    @Column("int", { nullable: true })
    Status: number;
}