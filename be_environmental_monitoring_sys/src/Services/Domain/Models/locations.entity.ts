import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Locations", { schema: "eco_monitoring" })
export class LocationsEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
    Id?: number;
    @Column({ type: 'varchar', length: 100 })
    Name?: string;
    @Column("datetime",{ nullable: true })
    CreatedAt?: Date;
}