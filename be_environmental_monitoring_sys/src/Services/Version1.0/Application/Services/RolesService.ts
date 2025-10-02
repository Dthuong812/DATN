import { PermissionsRepository } from "./../../Infrastructure/Repository/PermissionsRepository";
import { FunctionsRepository } from "./../../Infrastructure/Repository/FunctionsRepository";
import { UserRepository } from "./../../Infrastructure/Repository/UserRepository";
import { RoleFunctionPermissionDao } from "./../../Infrastructure/Dao/RoleFunctionPermissionDao";
import { Inject, Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { RolesEntity } from "../../Domain/Models/roles.entity";
import { PayloadCreateRoleDto, PayloadUpdateRoleDto, RolesDto } from "../../Domain/Dtos/roles.dto";
import { RolesRepository } from "../../Infrastructure/Repository/RoleRepository";
import { UserRoleAssignmentsRepository } from "../../Infrastructure/Repository/UserRoleAssignmentsRepository";
import { RoleFunctionPermissionRepository } from "../../Infrastructure/Repository/RoleFunctionPermissionRepository";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { RoleFunctionPermissionEntity } from "../../Domain/Models/role_function_permission.entity";
import { Mapper } from "../../Domain/Mapper/Mapper";
import { Not } from "typeorm";
import { ClientProxy } from "@nestjs/microservices";
import { REQUEST } from "@nestjs/core";

@Injectable()
export class RolesService extends CoreServiceBase<RolesEntity, RolesDto> {
  constructor(
    private readonly RolesRepository: RolesRepository,
    private readonly userRoleRepository: UserRoleAssignmentsRepository,
    private readonly RoleFunctionPermissionRepository: RoleFunctionPermissionRepository,
    private readonly RoleFunPerRepository: RoleFunctionPermissionRepository,
    private readonly UserRepository: UserRepository,
    private readonly FunctionsRepository: FunctionsRepository,
    private readonly PermissionsRepository: PermissionsRepository,
    @Inject("Version2") private dataClient: ClientProxy,
    @Inject(REQUEST) readonly request: Request
  ) {
    super(RolesRepository);
  }
  async createRole(payload: PayloadCreateRoleDto): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const roleData = await this.RolesRepository.getAll({
        where: {
          Code: payload.Code,
        },
      });
      if (roleData && roleData.length > 0) {
        res.Status = ErrorCode.SAVE_FAIL;
        res.Message = "Vai trò đã tồn tại";
        return res;
      }
      payload.CreatedAt = new Date();
      const newRole = await this.RolesRepository.create(
        Mapper.mapDtoToEntity(payload, RolesEntity)
      );

      if (payload.Projects && payload.Projects.length > 0) {
        const RoleFunctionPermission: RoleFunctionPermissionEntity[] = [];
        for (const project of payload.Projects) {
          if (project.Functions?.length > 0) {
            for (const func of project.Functions) {
              if (func.Permissions?.length > 0) {
                for (const perm of func.Permissions) {
                  const roleFuncPerm = new RoleFunctionPermissionEntity();
                  roleFuncPerm.RoleId = newRole.Id;
                  roleFuncPerm.FunctionId = func.Id;
                  roleFuncPerm.PermissionId = perm.Id;
                  roleFuncPerm.ProjectId = project.Id;
                  roleFuncPerm.Allowed = true;
                  RoleFunctionPermission.push(roleFuncPerm);
                }
              }
            }
          }
        }
        await this.RoleFunctionPermissionRepository.createMany(
          RoleFunctionPermission
        );
      }
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Tạo thành công";
      res.Data = newRole;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  //update
  async updateRole(
    Id: number,
    payload: PayloadUpdateRoleDto
  ): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const role = await this.RolesRepository.getById(Id);
      if (!role) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Vai trò không tồn tại";
        return res;
      }
      if(role.Code=== "SUPER_ADMIN"){
        res.Status = ErrorCode.SAVE_FAIL;
        res.Message = "Không thể sửa vai trò SUPER_ADMIN";
        return res;
      }
      else{
        const duplicateRole = await this.RolesRepository.getAll({
          where: {
            Code: payload.Code,
            Id: Not(Id),
          },
        });
        if (duplicateRole && duplicateRole.length > 0) {
          res.Status = ErrorCode.SAVE_FAIL;
          res.Message = "Code role đã tồn tại";
          return res;
        }
  
        await this.RolesRepository.update(
          { Id },
          Mapper.mapDtoToEntity(payload, RolesEntity)
        );
        await this.RoleFunctionPermissionRepository.delete({ RoleId: Id });
        // Update permissions
        if (payload.Projects && payload.Projects.length > 0) {
          const RoleFunctionPermission: RoleFunctionPermissionEntity[] = [];
          for (const project of payload.Projects) {
            if (project.Functions?.length > 0) {
              for (const func of project.Functions) {
                if (func.Permissions?.length > 0) {
                  for (const perm of func.Permissions) {
                    const roleFuncPerm = new RoleFunctionPermissionEntity();
                    roleFuncPerm.RoleId = role.Id;
                    roleFuncPerm.FunctionId = func.Id;
                    roleFuncPerm.PermissionId = perm.Id;
                    roleFuncPerm.ProjectId = project.Id;
                    roleFuncPerm.Allowed = true;
                    RoleFunctionPermission.push(roleFuncPerm);
                  }
                }
              }
            }
          }
          await this.RoleFunctionPermissionRepository.createMany(
            RoleFunctionPermission
          );
        }
        res.Status = ErrorCode.SUCCESS;
        res.Message = "Cập nhật thành công";
        res.Data = role;
      }

    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  async deleteRole(Id: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const role = await this.RolesRepository.getById(Id);
      if (!role) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Vai trò không tồn tại";
        return res;
      }
      if(role.Code=== "SUPER_ADMIN"){
        res.Status = ErrorCode.SAVE_FAIL;
        res.Message = "Không thể xóa vai trò SUPER_ADMIN";
        return res;
      }
      else{
        const userAssignments = await this.userRoleRepository.getAll({
          where: { RoleId: Id },
        });
        if (userAssignments.length > 0) {
          res.Status = ErrorCode.SAVE_FAIL;
          res.Message = "Không thể xóa vai trò đang có người sử dụng";
          return res;
        }
        await this.RolesRepository.delete({ Id });
        await this.RoleFunctionPermissionRepository.delete({ RoleId: Id });
        res.Status = ErrorCode.SUCCESS;
        res.Message = "Xóa thành công";
      }
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }

  async getAllRoles(): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const roles = await this.RolesRepository.getAll();
      if (!roles || roles.length === 0) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Không tìm thấy vai trò";
        return res;
      }
      const roleUser = await Promise.all(
        roles.map(async (role) => {
          const user = await this.userRoleRepository.getAll({
            where: { RoleId: role.Id },
          });
          return {
            ...role,
            TotalUser: user.length,
          };
        })
      );
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lí thành công";
      res.Data = roleUser;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  async getRoleById(Id: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const role = await this.RolesRepository.getById(Id);
      if (!role) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Không tìm thấy vai trò";
        return res;
      }
  
      const users = await this.userRoleRepository.getAll({
        where: { RoleId: role.Id },
      });
      const user = await Promise.all(
        users.map(async (user) => {
          const userEntity = await this.UserRepository.getById(user.UserId);
          return {
            Id: userEntity.Id,
            Username: userEntity.UserName,
            FullName: userEntity.FullName,
            Phone: userEntity.Phone,
            Email: userEntity.Email,
          };
        })
      );
  
      const projects = await this.dataClient
        .send("message_getAll_projects", {})
        .toPromise();
  
      const roleFuncPerms = await this.RoleFunPerRepository.getAll({
        where: { RoleId: role.Id },
      });
  
      const projectsMap = new Map<number, any>();
  
      for (const rfp of roleFuncPerms) {
        const func = await this.FunctionsRepository.getById(rfp.FunctionId);
        const perm = await this.PermissionsRepository.getById(rfp.PermissionId);
  
        if (!projectsMap.has(rfp.ProjectId)) {
          const project = projects.Data.find((p: any) => p.Id === rfp.ProjectId);
          projectsMap.set(rfp.ProjectId, {
            Id: project?.Id || rfp.ProjectId,
            Name: project?.Name || "",
            Functions: [],
          });
        }
  
        const project = projectsMap.get(rfp.ProjectId);
  
        let functionEntry = project.Functions.find((f: any) => f.Id === func.Id);
        if (!functionEntry) {
          functionEntry = {
            Id: func.Id,
            Name: func.Name,
            Code: func.Code,
            Permissions: [],
          };
          project.Functions.push(functionEntry);
        }
  
        functionEntry.Permissions.push({
          Id: perm.Id,
          Code: perm.Code,
          Name: perm.Name,
        });
      }
  
      const result = {
        ...role,
        TotalUser: users.length,
        TotalProjects: projectsMap.size,
        TotalFunctions: roleFuncPerms.length,
        TotalPermissions: roleFuncPerms.length,
        Users: user,
        Projects: Array.from(projectsMap.values()),
      };
  
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lý thành công";
      res.Data = result;
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
}
