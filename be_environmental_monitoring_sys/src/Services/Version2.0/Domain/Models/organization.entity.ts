import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Organization ", { schema: "ecomonitor_data" })
export class OrganizationEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  Id?: number;

  @Column({ type: "int" })
  Local_Id?: number;

  @Column("varchar", { length: 20, nullable: false, unique: true })
  Code?: string;

  @Column({ type: "int" })
  Parent_Id?: number;

  @Column("varchar", { length: 255, nullable: false, unique: true })
  Name?: string;

  @Column("varchar", { length: 20, nullable: false, unique: true })
  Phone?: string;

  @Column("varchar", { length: 100, nullable: false, unique: true })
  Email?: string;

  @Column("int", { nullable: true })
  CreatedBy?: number;

  @Column("datetime", { nullable: true })
  CreatedAt?: Date;

  @Column("datetime", { nullable: true })
  UpdatedAt?: Date;


  @Column("int", { nullable: true })
  UpdatedBy?: number;
  
  @DeleteDateColumn()
  DeletedAt?: Date;
}
