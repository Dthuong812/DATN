import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("SensorTypes",{schema: " eco_monitoring" })
export class SensorsTypesEntity {
    @PrimaryGeneratedColumn({ type: "int", name: "Id" })
    Id: number;
    @Column("varchar", { name: "Name", length: 100 })
    Name: string;
    @Column({ type: 'text' })
    Description: string;
    @Column("varchar", { name: "Unit", length: 50 })
    Unit: string;
    @Column("int",)
    Min_Value: number;
    @Column("int",)
    Max_Value: number;
    @Column("datetime", { nullable: true})
    CreatedAt: Date;
    @Column("datetime", { nullable: true})
    UpdatedAt: Date;
    @Column("int", { nullable: true} )
    CreatedBy: number;
    @Column("int", { nullable: true})
    UpdatedBy: number;
    @Column("datetime", { nullable: true })
    DeletedAt: Date
    @Column("int", { nullable: true})
    DeletedBy: number;
}