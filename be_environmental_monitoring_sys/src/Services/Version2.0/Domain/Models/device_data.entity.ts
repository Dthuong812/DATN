import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("DeviceData", { schema: "ecomonitor_data" })
export class DeviceDataEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  Id?: number;

  @Column("varchar", { length: 20, nullable: false, unique: true })
  Object_Code?: string;

  @Column("varchar", { length: 20, nullable: false, unique: true })
  Project_Code?: string;

  @Column("varchar", { length: 20, nullable: false, unique: true })
  Device_Code?: string;

  @Column({ type: "json", nullable: true })
  DataJson?: Record<string, any>;

  @Column("datetime", { nullable: false })
  Times?: Date;

  @Column({ type: "double", nullable: true })
  Speed?: number;

  @Column({ type: "int", nullable: true })
  DataType?: number

  @Column({ type: "decimal", precision: 10, scale: 8 })
  Latitude?: number;

  @Column({ type: "decimal", precision: 10, scale: 8 })
  Longitude?: number;
}
