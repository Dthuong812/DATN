import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("AlertTypes", { schema: "eco_monitoring" })
export class AlertTypesEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  Id?: number;

  @Column("varchar", { length: 100, nullable: false, unique: true })
  Name?: string; 

  @Column("varchar", { length: 255, nullable: true })
  Description?: string;  

  @Column("varchar", { length: 20, nullable: false })
  Severity?: string; 
}
