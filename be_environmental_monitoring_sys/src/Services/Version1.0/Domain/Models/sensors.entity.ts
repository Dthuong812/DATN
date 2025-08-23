import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Sensors",{schema:"eco_monitoring"})
export class SensorsEntity {
    @PrimaryGeneratedColumn({ type: "int", name: "Id" })
    Id?: number;
    @Column("varchar", { length: 100 })
    Name?:string;
    @Column("int")   
    DeviceId?: number;
    @Column("int")
    TypeId?: number;
    @Column("varchar", { length: 100 })
    Series?:string;
    @Column("varchar", { length: 200 })
    NhaSX?:string;
    @Column("varchar", { length: 100 })
    Model?: string;
    @Column("int")
    Status?: number;
    @Column("datetime",{nullable:true} )
    CreatedAt?: Date;
    @Column("datetime",{nullable:true} )
    UpdatedAt?: Date;
    @Column("int",{nullable:true} )
    CreatedBy?: number;
    @Column("int",{nullable:true} )
    UpdatedBy?: number;
    @DeleteDateColumn()
    DeletedAt?: Date
    @Column("int",{nullable:true} )
    DeletedBy?: number;

}