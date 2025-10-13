import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "sensor_config" })
export class SensorConfigEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ length: 50, unique: true })
  Code: string; 

  @Column({ length: 100 })
  Label: string; 

  @Column({ length: 20, nullable: true })
  Unit: string; 

  @Column({ type: "json" })
  Thresholds: number[]; 

  @Column({ type: "json" })
  Colors: string[]; 

  @Column({ type: "json" })
  Descriptions: string[]; 

  @Column({ length: 50 })
  Field: string; 
}
