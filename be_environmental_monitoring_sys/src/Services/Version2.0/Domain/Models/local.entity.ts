import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("local", { schema: "ecomonitor_data" })
export class LocalEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  Id?: number;

  @Column("varchar", { length: 100, nullable: false })
  Name?: string;
}