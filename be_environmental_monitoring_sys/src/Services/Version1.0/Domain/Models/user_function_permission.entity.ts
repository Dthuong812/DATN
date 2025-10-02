import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("userfunctionpermission", { schema: "eco_monitoring" })
export class UserFunctionPermissionEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'Id' })    
    Id?: number;
    @Column({ type: 'int' })
    UserId?: number;
    @Column({type:"int"})
    Organization_Id?: number;
    @Column({type:"int"})
    ProjectId?: number;
    @Column({ type: 'int' })
    FunctionId?: number;
    @Column({ type: 'int' })
    PermissionId?: number;
}