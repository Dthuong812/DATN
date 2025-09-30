import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity("roles", { schema: "eco_monitoring" })
export class RolesEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
    Id: number;
    @Column({ type: 'varchar', length: 50  })
    Code: string;
    @Column({ type: 'varchar', length: 200  })
    Name: string;
    @Column({ type: 'text' })
    Description: string;
    @Column("datetime",{ nullable: true })
    CreatedAt: Date;
}