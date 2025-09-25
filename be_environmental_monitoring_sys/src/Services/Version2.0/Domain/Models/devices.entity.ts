import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("Devices", { schema: "ecomonitor_data" })
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
  Icon_Id?: number;

  @Column("varchar", { length: 100, nullable: false, unique: true })
  Series?: string;

  @Column({ type: "json", nullable: true })
  Details_Data?: Record<string, any>;

  @Column({ type: "double"})
  Latitude?: number;

  @Column({ type: "double"})
  Longitude?: number;

  @Column("int", { nullable: true })
  CreatedBy?: number;

  @Column("datetime", { nullable: true })
  CreatedAt?: Date;

  @Column("datetime", { nullable: true })
  UpdatedAt?: Date;

  @Column("int", { nullable: true })
  UpdatedBy?: number;

  @DeleteDateColumn()
  DeletedAt?: Date;
}
