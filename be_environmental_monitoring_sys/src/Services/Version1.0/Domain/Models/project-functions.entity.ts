import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity("projectfunctions",{schema:"eco_monitoring"})
export class ProjectFunctionsEntity {
    @PrimaryGeneratedColumn({ type: 'int', })
    Id?: number;
    @Column("int",{ nullable: true })
    FunctionId?: number;
    @Column("int",{ nullable: true })
    ProjectId?: number;
}
