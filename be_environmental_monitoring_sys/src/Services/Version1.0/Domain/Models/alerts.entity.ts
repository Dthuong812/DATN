import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Alerts", { schema: "eco_monitoring" })
export class AlertsEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  Id?: number;

  @Column("int", { nullable: false })
  DeviceId?: number;

  @Column("int", { nullable: false })
  SensorsId?: number;

  @Column("int", { nullable: false })
  AlertTypeId?: number;

  @Column("datetime", { nullable: false })
  AlertTime?: Date;

  @Column("boolean", { default: false })
  IsResolved?: boolean;

  @Column("varchar", { length: 255, nullable: true })
  Description?: string;

  @DeleteDateColumn()
  DeletedAt?: Date;
}