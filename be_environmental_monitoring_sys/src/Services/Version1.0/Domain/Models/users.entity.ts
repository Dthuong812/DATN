import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Users",{schema:"eco_monitoring"})
export class UserEntity {
    @PrimaryGeneratedColumn({ type: 'int', })
    Id?: number;
    @Column("varchar",{ unique: true, length: 50 })
    UserName?: string;
    @Column("varchar",  {  length: 200 })
    PassWord?: string;
    @Column("varchar", { length: 100 })
    FullName?: string;
    @Column("varchar", {length: 200 })
    Email?: string;
    @Column("varchar", { length: 20 })
    Phone?: string;
    @Column("datetime",{ nullable: true })
    ChangePasswordAt?: Date;
    @Column("int")
    Active?: number;
    @Column("int",{ nullable: true })
    Organization_Id?: number;
    @Column("int",{ nullable: true })
    Department_Id?: number;
    @Column("int")
    CreatedBy?: number;
    @Column("datetime",{ nullable: true })
    CreatedAt?: Date;
    @Column("int",{ nullable: true })
    UpdatedBy?: number;
    @Column("datetime",{ nullable: true })
    UpdatedAt?: Date;
    @DeleteDateColumn()
    DeletedAt?: Date
}