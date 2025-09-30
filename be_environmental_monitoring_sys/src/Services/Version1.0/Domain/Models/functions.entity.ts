import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("functions", { schema: "eco_monitoring" })
export class FunctionsEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'Id' })    
    Id: number;
    @Column({ type: 'varchar', length: 50 })
    Code: string;
    @Column({ type: 'varchar', length: 200 })
    Name: string;
    @Column("text", {  nullable: true })
    Description: string;
    @Column("datetime",{ nullable: true })
    CreatedAt: Date;
}