import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("DeviceType", { schema: "ecomonitor_data" })
export class DeviceTypeEntity {
  @PrimaryGeneratedColumn("uuid")
  Code?: string;

  @Column("varchar", { length: 255, nullable: false, unique: true })
  Name?: string;
}
