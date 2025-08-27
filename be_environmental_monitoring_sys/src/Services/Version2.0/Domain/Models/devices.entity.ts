import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("Device", { schema: "ecomonitor_data" })
export class DeviceEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  Id?: number;

  @Column("varchar", { length: 20, nullable: false, unique: true })
  Code?: string;

  @Column("varchar", { length: 255, nullable: false, unique: true })
  Name?: string;

  @Column("varchar", { length: 20, nullable: false, unique: true })
  Object_Code?: string;

  @Column("varchar", { length: 20, nullable: false, unique: true })
  DeviceType_Code?: string;

  @Column({ type: "int" })
  DeviceType_Id?:  number;

  @Column({ type: "int" })
  Icon_Id?: number;

  @Column("varchar", { length: 100, nullable: false, unique: true })
  Series?: string;

  @Column({ type: "json", nullable: true })
  Details_Data?: Record<string, any>;

  @Column({ type: "decimal", precision: 10, scale: 8 })
  Latitude?: number;

  @Column({ type: "decimal", precision: 10, scale: 8 })
  Longitude?: number;
}
