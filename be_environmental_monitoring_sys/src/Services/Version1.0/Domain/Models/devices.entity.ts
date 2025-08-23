import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("Devices", { schema: "eco_monitoring" })
export class DevicesEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  Id?: number;

  @Column("varchar", { length: 150, nullable: true })
  Name?: string;

  @Column({ type: "varchar", length: 15, unique: true })
  Series?: string;

  @Column("varchar", { length: 255, nullable: true })
  Description?: string;

  @Column("varchar", { length: 10, nullable: true })
  Sim?: string;

  @Column("int", { nullable: true })
  StationId?: number;

  @Column("datetime", { nullable: true })
  LastConnectedAt?: Date;

  @Column("int", { nullable: true })
  Status?: number;

  @Column("datetime", { nullable: true })
  CreatedAt?: Date;

  @Column("int", { nullable: true })
  CreatedBy?: number;

  @Column("datetime", { nullable: true })
  UpdatedAt?: Date;

  @Column("int", { nullable: true })
  UpdatedBy?: number;

  @DeleteDateColumn()
  DeletedAt?: Date;

  @Column("int", { nullable: true })
  DeletedBy?: number;
}
