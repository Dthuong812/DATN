import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ProjectOrganization ", { schema: "ecomonitor_data" })
export class ProjectOrganizationEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  Id?: number;

  @Column("varchar", { length: 20, nullable: false, unique: true })
  Project_Code?: string;

  @Column({ type: "int" })
  Organization_Id?: number;
}
