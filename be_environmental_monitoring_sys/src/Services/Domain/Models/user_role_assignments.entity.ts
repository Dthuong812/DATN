import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity("UserRoleAssignments",{schema:"eco_monitoring"})
export class UserRoleAssignmentsEntity {
    @PrimaryGeneratedColumn({ type: 'int', })
    Id: number;
    @Column("int",{ nullable: true })
    UserId: number;
    @Column("int",{ nullable: true })
    RoleId: number;
    @Column("int",{ nullable: true })
    CreatedBy: number;
    @Column("datetime",{ nullable: true })
    CreatedAt: Date;
}
