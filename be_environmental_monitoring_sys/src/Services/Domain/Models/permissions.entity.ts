import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Permissions", { schema: "eco_monitoring" })
export class PermissionsEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
    Id: number;

    @Column({ type: 'varchar', length: 50 })
    Code: string;

    @Column({ type: 'varchar', length: 200 })
    Name: string;
}