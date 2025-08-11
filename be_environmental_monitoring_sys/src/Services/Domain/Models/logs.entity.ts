import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Logs", { schema: "eco_monitoring" })
export class LogsEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
    Id?: number;

    @Column({ type: 'int', name: 'LogTypeId' })
    LogTypeId?: number;

    @Column({ type: 'varchar', length: 50 })
    Action?: string;

    @Column({ type: 'varchar', length: 100 })
    Method?: string;

    @Column({ type: 'text' })
    Content?: string;

    @Column({ type: 'text' })
    Data?: string;

    @Column("datetime")
    CreatedAt?: Date;

    @Column({ type: 'int', nullable: true  })
    CreatedBy?: number;
}