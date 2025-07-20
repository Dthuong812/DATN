import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Users",{schema:"eco_monitor"})
export class User {
    @PrimaryGeneratedColumn({ type: 'int', })
    Id: number;
    @Column("varchar",{ unique: true, length: 50 })
    UserName: string;
    @Column("varchar",  {  length: 200 })
    PassWord: string;
    @Column("varchar", { length: 100 })
    FullName: string;
    @Column("varchar", {length: 200 })
    Email: string;
    @Column("varchar", { length: 20 })
    Phone: string;
    @Column("datetime",{ nullable: true })
    ChangePasswordAt: Date;
    @Column("int")
    Location_Id: number;
    @Column("tinyint", {
        nullable: true,
        default: () => "'0'",
    })
    IsManagement: number;
    @Column("int",{ nullable: true })
    Active: number;
    @Column("int",{ nullable: true })
    CreatedBy: number;
    @Column("datetime",{ nullable: true })
    CreatedAt: Date;
    @Column("int",{ nullable: true })
    UpdatedBy: number;
    @Column("datetime",{ nullable: true })
    UpdatedAt: Date;
}