import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Project", { schema: "ecomonitor_data" })
export class ProjectEntity {
  @PrimaryGeneratedColumn("increment")
  Id?: number;

  @Column("varchar", { length: 20, nullable: false, unique: true })
  Code?: string; 

  @Column("varchar", { length: 255, nullable: false, unique: true })
  Name?: string; 

  @Column("text", { nullable: true })
  Description?: string;  
}
