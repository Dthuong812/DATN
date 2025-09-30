import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("DeviceData", { schema: "ecomonitor_data" })
export class DeviceDataEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  Id?: number;

  @Column("varchar", { length: 20, nullable: false })
  Object_Code?: string;

  @Column("varchar", { length: 20, nullable: false})
  Project_Code?: string;

  @Column("varchar", { length: 20, nullable: false})
  Devices_Code?: string;

  @Column({ type: "json", nullable: true })
  DataJson?: Record<string, any>;

  @Column("datetime", { nullable: false })
  Times?: Date;

  @Column({ type: "double", nullable: true })
  Speed?: number;

  @Column({ type: "int", nullable: true })
  DataType?: number

  @Column({ type: "double"})
  Latitude?: number;

  @Column({ type: "double"})
  Longitude?: number;
}
