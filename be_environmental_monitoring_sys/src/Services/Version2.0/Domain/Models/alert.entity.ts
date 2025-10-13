import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity("alerts", { schema: "ecomonitor_data" })
export class AlertEntity {
  @PrimaryGeneratedColumn()
  Id?: number;

  @Column()
  Object_Code?: string;

  @Column()
  Object_Name?: string;

  @Column()
  Type?: string; 

  @Column()
  Level?: string; 

  @Column()
  Message?: string;

  @Column({ type: "float", nullable: true })
  Value?: number;

  @Column({ nullable: true })
  Unit?: string;
  @Column({ default: false })
  IsRead?: boolean;
  @CreateDateColumn()
  CreatedAt?: Date;
}
