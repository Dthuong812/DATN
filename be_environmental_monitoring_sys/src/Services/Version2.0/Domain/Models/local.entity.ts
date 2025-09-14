import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("Local", { schema: "ecomonitor_data" })
export class LocalEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  Id?: number;

  @Column("varchar", { length: 100, nullable: false })
  Name?: string;
}