import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("RoleFunctionPermission", { schema: "eco_monitoring" })
export class RoleFunctionPermissionEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'Id' })    
    Id: number;
    @Column({ type: 'int' })
    RoleId: number;
    @Column({ type: 'int' })
    FunctionId: number;
    @Column({ type: 'int' })
    PermissionId: number;
    @Column("tinyint", { default: () => "'0'" })
    Allowed: boolean;
}