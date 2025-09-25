import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("Object", { schema: "ecomonitor_data" })
export class ObjectEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  Id?: number;

  @Column("varchar", { length: 20, nullable: false, unique: true })
  Code?: string;

  @Column("varchar", { length: 255, nullable: false, unique: true })
  Name?: string;

  @Column("varchar", { length: 20, nullable: false, unique: true })
  Project_Code?: string;

  @Column("varchar", { length: 20, nullable: false, unique: true })
  Organization_Code?: string;

  @Column({ type: "int" })
  Status?: number;

  @Column({ type: "double"})
  Latitude?: number;

  @Column({ type: "double"})
  Longitude?: number;

  @Column({ type: "json", nullable: true })
  Details_Value?: Record<string, any>;

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
