import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("project_organization", { schema: "ecomonitor_data" })
export class ProjectOrganizationEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  Id?: number;

  @Column({ type: "int" })
  Project_Id?:  number;

  @Column({ type: "int" })
  Organization_Id?: number;
}
