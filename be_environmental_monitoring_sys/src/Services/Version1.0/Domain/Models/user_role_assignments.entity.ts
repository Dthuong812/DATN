import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity("userroleassignments",{schema:"eco_monitoring"})
export class UserRoleAssignmentsEntity {
    @PrimaryGeneratedColumn({ type: 'int', })
    Id?: number;
    @Column("int",{ nullable: true })
    UserId?: number;
    @Column("int",{ nullable: true })
    RoleId?: number;
    @Column("int",{ nullable: true })
    Organization_Id?: number
    @Column("int",{ nullable: true })
    ProjectId?: number

}
