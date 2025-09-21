import { Inject, Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import * as argon2 from "argon2";
import { UserEntity } from "../../Domain/Models/users.entity";
import {
  PayLoadCreateUserDto,
  PayLoadUpdateUserDto,
  UserDto,
} from "../../Domain/Dtos/users.dto";
import { UserRepository } from "../../Infrastructure/Repository/UserRepository";
import { UserRoleAssignmentsRepository } from "../../Infrastructure/Repository/UserRoleAssignmentsRepository";
import { RolesRepository } from "../../Infrastructure/Repository/RoleRepository";
import { RoleFunctionPermissionRepository } from "../../Infrastructure/Repository/RoleFunctionPermissionRepository";
import { FunctionsRepository } from "../../Infrastructure/Repository/FunctionsRepository";
import { PermissionsRepository } from "../../Infrastructure/Repository/PermissionsRepository";
import { Mapper } from "../../Domain/Mapper/Mapper";
import { UserRoleAssignmentsDto } from "../../Domain/Dtos/user_role_assignments.dto";
import { ClientProxy } from "@nestjs/microservices";
import { REQUEST } from "@nestjs/core";
import { firstValueFrom } from "rxjs";
import { UserFunctionPermissionDto } from "../../Domain/Dtos/user_function_permission.dto";
import { UserFunctionPermissionRepository } from "../../Infrastructure/Repository/UserFunctionPermissionRepository";
import { In } from "typeorm";

@Injectable()
export class UserService extends CoreServiceBase<UserEntity, UserDto> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRoleAssignmentsRepository: UserRoleAssignmentsRepository,
    private readonly roleRepository: RolesRepository,
    private readonly RoleFunPerRepository: RoleFunctionPermissionRepository,
    private readonly FunctionsRepository: FunctionsRepository,
    private readonly PermissionsRepository: PermissionsRepository,
    private readonly userFuncPerRepository : UserFunctionPermissionRepository,
    @Inject("Version2") private dataClient: ClientProxy,
    @Inject(REQUEST) readonly request: Request
  ) {
    super(userRepository);
  }
  async getAllUsers(): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const users = await this.userRepository.getAll();
      const allRoleMappings = await this.userRoleAssignmentsRepository.getAll();
      const allRoles = await this.roleRepository.getAll();
      const orgData = await firstValueFrom(
        this.dataClient.send("message_get_all_org", {})
      );
      const depData = await firstValueFrom(
        this.dataClient.send("message_get_all_dept", {})
      );

      const orgList = Array.isArray(orgData?.Data) ? orgData.Data : [];
      const depList = Array.isArray(depData?.Data) ? depData.Data : [];

      const userWithRoles = users.map((user) => {
        const roleMappings = allRoleMappings.filter(
          (rm) => rm.UserId === user.Id
        );
        const roles = roleMappings
          .map((rm) => allRoles.find((r) => r.Id === rm.RoleId))
          .filter(Boolean)
          .map((r) => ({
            Id: r.Id,
            Code: r.Code,
            Name: r.Name,
            Description: r.Description,
          }));
        const org = orgList.find((o: any) => o.Id === user.Organization_Id);
        const dept = depList.find((d: any) => d.Id === user.Department_Id);

        return {
          ...user,
          Roles: roles,
          OrganizationName: org?.Name || null,
          DepartmentName: dept?.Name || null,
        };
      });

      res.Data = userWithRoles;
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lý thành công";
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }

  async createUser(
    payload: PayLoadCreateUserDto,
    authId: number
  ): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const users = await this.userRepository.getAll();

      // Kiểm tra điều kiện
      const usernameExists = users.find(
        (user) => user.UserName === payload.UserName
      );
      if (usernameExists) {
        res.Status = ErrorCode.SAVE_FAIL;
        res.Message = "Tên người dùng đã tồn tại";
        return res;
      }

      const emailExists = users.find((user) => user.Email === payload.Email);
      if (emailExists) {
        res.Status = ErrorCode.SAVE_FAIL;
        res.Message = "Email đã tồn tại";
        return res;
      }

      const phoneExists = users.find((user) => user.Phone === payload.Phone);
      if (phoneExists) {
        res.Status = ErrorCode.SAVE_FAIL;
        res.Message = "Số điện thoại đã tồn tại";
        return res;
      }
      if (payload.Projects && payload.Projects.length > 0) {
        for (const project of payload.Projects) {
          if (project.Roles && project.Roles.length > 0) {
            for (const role of project.Roles) {
              const existingRole = await this.roleRepository.getById(role.Id);
              if (!existingRole) {
                res.Status = ErrorCode.SAVE_FAIL;
                res.Message = `Vai trò không tồn tại`;
                return res;
              }
            }
          }
        }
        if (payload.PassWord) {
          payload.PassWord = await argon2.hash(payload.PassWord);
        }
        payload.CreatedBy = authId;
        payload.CreatedAt = new Date();
        payload.Active = 1;
        // Tạo người dùng mới
        const newUser = await this.userRepository.create(
          Mapper.mapDtoToEntity(payload, UserEntity)
        );

        // Gán vai trò cho người dùng nếu có
        if (payload.Projects && payload.Projects.length > 0) {
          const Projects: UserRoleAssignmentsDto[] = [];
          for (const project of payload.Projects) {
            if (project.Roles && project.Roles.length > 0) {
              for (const role of project.Roles) {
                const userRole = new UserRoleAssignmentsDto();
                userRole.UserId = newUser.Id;
                userRole.RoleId = role.Id;
                userRole.Organization_Id = newUser.Organization_Id;
                userRole.ProjectId = project.ProjectId;
                Projects.push(userRole);
              }
            }
          }
          await this.userRoleAssignmentsRepository.createMany(Projects);
        }
        if(payload.FuncPers && payload.FuncPers.length >0){
          const FuncPers : UserFunctionPermissionDto[]= [];
          for(const fp of payload.FuncPers){
            if(fp.Functions && fp.Functions.length >0){
              for(const func of fp.Functions){
                if(func.Permissions && func.Permissions.length >0){
                  for(const perm of func.Permissions){
                    const userFuncPer = new UserFunctionPermissionDto();
                    userFuncPer.UserId = newUser.Id;
                    userFuncPer.Organization_Id = newUser.Organization_Id;
                    userFuncPer.ProjectId = fp.ProjectId;
                    userFuncPer.FunctionId = func.Id;
                    userFuncPer.PermissionId = perm.Id;
                    FuncPers.push(userFuncPer);
                  }
              }
            }
          }
        }
          await this.userFuncPerRepository.createMany(FuncPers);
        }

        res.Status = ErrorCode.SUCCESS;
        res.Message = "Tạo người dùng thành công";
        res.Data = newUser;
      }
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }

  async updateUser(
    Id: number,
    payload: PayLoadUpdateUserDto,
    authId: number
  ): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const user = await this.userRepository.getById(Id);
      if (!user) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Không tìm thấy người dùng";
        return res;
      }

      const users = await this.userRepository.getAll();

      const usernameExists = users.find(
        (u) => u.UserName === payload.UserName && u.Id !== Id
      );
      if (usernameExists) {
        res.Status = ErrorCode.SAVE_FAIL;
        res.Message = "Tên người dùng đã tồn tại";
        return res;
      }

      const emailExists = users.find(
        (u) => u.Email === payload.Email && u.Id !== Id
      );
      if (emailExists) {
        res.Status = ErrorCode.SAVE_FAIL;
        res.Message = "Email đã tồn tại";
        return res;
      }

      const phoneExists = users.find(
        (u) => u.Phone === payload.Phone && u.Id !== Id
      );
      if (phoneExists) {
        res.Status = ErrorCode.SAVE_FAIL;
        res.Message = "Số điện thoại đã tồn tại";
        return res;
      }

      if (payload.PassWord) {
        payload.PassWord = await argon2.hash(payload.PassWord);
      }
      payload.UpdatedBy = authId;
      payload.UpdatedAt = new Date();
      payload.Active = 1;
      if (payload.Projects && payload.Projects.length > 0) {
        for (const project of payload.Projects) {
          if (project.Roles && project.Roles.length > 0) {
            for (const role of project.Roles) {
              const existingRole = await this.roleRepository.getById(role.Id);
              if (!existingRole) {
                res.Status = ErrorCode.SAVE_FAIL;
                res.Message = `Vai trò không tồn tại`;
                return res;
              }
            }
          }
        }

        await this.userRepository.update(
          { Id },
          Mapper.mapDtoToEntity(payload, UserEntity)
        );
        // Xóa các vai trò cũ của người dùng
        await this.userRoleAssignmentsRepository.delete({ UserId: Id });
        await this.userFuncPerRepository.delete({UserId: Id});
        // Gán vai trò mới cho người dùng
        if (payload.Projects && payload.Projects.length > 0) {
          const Projects: UserRoleAssignmentsDto[] = [];
          for (const project of payload.Projects) {
            if (project.Roles && project.Roles.length > 0) {
              for (const role of project.Roles) {
                const userRole = new UserRoleAssignmentsDto();
                userRole.UserId = user.Id;
                userRole.RoleId = role.Id;
                userRole.Organization_Id = user.Organization_Id;
                userRole.ProjectId = project.ProjectId;
                Projects.push(userRole);
              }
            }
          }
          await this.userRoleAssignmentsRepository.createMany(Projects);
        }
        if(payload.FuncPers && payload.FuncPers.length >0){
          const FuncPers : UserFunctionPermissionDto[]= [];
          for(const fp of payload.FuncPers){
            if(fp.Functions && fp.Functions.length >0){
              for(const func of fp.Functions){
                if(func.Permissions && func.Permissions.length >0){
                  for(const perm of func.Permissions){
                    const userFuncPer = new UserFunctionPermissionDto();
                    userFuncPer.UserId = user.Id;
                    userFuncPer.Organization_Id = user.Organization_Id;
                    userFuncPer.ProjectId = fp.ProjectId;
                    userFuncPer.FunctionId = func.Id;
                    userFuncPer.PermissionId = perm.Id;
                    FuncPers.push(userFuncPer);
                  }
              }
            }
          }
        }
          await this.userFuncPerRepository.createMany(FuncPers);
        }
        res.Status = ErrorCode.SUCCESS;
        res.Message = "Cập nhật thành công";
      }
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  async deleteUser(Id: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const user = await this.userRepository.getById(Id);
      if (!user) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Không tìm thấy người dùng";
        return res;
      }
      await this.userRoleAssignmentsRepository.delete({ UserId: Id });
      await this.userFuncPerRepository.delete({UserId: Id});
      await this.userRepository.delete({ Id });
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xóa thành công";
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  async getUserById(Id: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const user = await this.userRepository.getById(Id);
      if (!user) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Không tìm thấy người dùng";
        return res;
      }
      const proRoleMappings = await this.userRoleAssignmentsRepository.getAll({
        where: { UserId: user.Id },
      });
  
      if (!proRoleMappings.length) {
        res.Data = { ...user, Projects: [] };
        res.Status = ErrorCode.SUCCESS;
        res.Message = "Xử lý thành công";
        return res;
      }
  
      const proIds = proRoleMappings.map((p) => p.ProjectId);
  

      const projects = await firstValueFrom(
        this.dataClient.send("message_getAll_projects", {})
      );
      const projectList = Array.isArray(projects?.Data) ? projects.Data : [];
      const userProjects = projectList.filter((p: any) =>
        proIds.includes(p.Id)
      );
  
      const roleIds = proRoleMappings.map((p) => p.RoleId);
      const roles = await this.roleRepository.getAll({
        where: { Id: In(roleIds) },
      });

      const roleFuncPerms = await this.RoleFunPerRepository.getAll({
        where: { RoleId: In(roleIds), ProjectId: In(proIds) },
      });

      const userFuncPerms = await this.userFuncPerRepository.getAll({
        where: { UserId: user.Id, ProjectId: In(proIds) },
      });
  
      const funcIds = [
        ...roleFuncPerms.map((rfp) => rfp.FunctionId),
        ...userFuncPerms.map((ufp) => ufp.FunctionId),
      ];
      const permIds = [
        ...roleFuncPerms.map((rfp) => rfp.PermissionId),
        ...userFuncPerms.map((ufp) => ufp.PermissionId),
      ];
  
      const funcs = await this.FunctionsRepository.getAll({
        where: { Id: In(funcIds) },
      });
      const perms = await this.PermissionsRepository.getAll({
        where: { Id: In(permIds) },
      });
  
      const funcMap = new Map<number, any>();
      funcs.forEach((f) => funcMap.set(f.Id, f));
  
      const permMap = new Map<number, any>();
      perms.forEach((p) => permMap.set(p.Id, p));

      const projectWithRoles = userProjects.map((project: any) => {
        const roleIdsOfProject = proRoleMappings
          .filter((m) => m.ProjectId === project.Id)
          .map((m) => m.RoleId);
  
        const rolesOfProject = roles.filter((r) =>
          roleIdsOfProject.includes(r.Id)
        );
  
        const roleWithFunctions = rolesOfProject.map((role) => {
          const rfpOfRole = roleFuncPerms.filter(
            (rfp) => rfp.RoleId === role.Id && rfp.ProjectId === project.Id
          );
  
          const funcPermMap = new Map<number, any>();
  
          for (const rfp of rfpOfRole) {
            const func = funcMap.get(rfp.FunctionId);
            const perm = permMap.get(rfp.PermissionId);
  
            if (!func || !perm) continue;
  
            if (!funcPermMap.has(func.Id)) {
              funcPermMap.set(func.Id, {
                Id: func.Id,
                Code: func.Code,
                Name: func.Name,
                Permissions: [],
              });
            }
  
            funcPermMap.get(func.Id).Permissions.push({
              Id: perm.Id,
              Code: perm.Code,
              Name: perm.Name,
            });
          }
  
          return {
            Id: role.Id,
            Code: role.Code,
            Name: role.Name,
            Description: role.Description,
            Functions: Array.from(funcPermMap.values()),
          };
        });
  
        const ufpOfProject = userFuncPerms.filter(
          (ufp) => ufp.ProjectId === project.Id
        );
  
        const userFuncMap = new Map<number, any>();
        for (const ufp of ufpOfProject) {
          const func = funcMap.get(ufp.FunctionId);
          const perm = permMap.get(ufp.PermissionId);
  
          if (!func || !perm) continue;
  
          if (!userFuncMap.has(func.Id)) {
            userFuncMap.set(func.Id, {
              Id: func.Id,
              Code: func.Code,
              Name: func.Name,
              Permissions: [],
            });
          }
  
          userFuncMap.get(func.Id).Permissions.push({
            Id: perm.Id,
            Code: perm.Code,
            Name: perm.Name,
          });
        }
  
        return {
          Id: project.Id,
          Code: project.Code,
          Name: project.Name,
          Roles: roleWithFunctions,
          UserFunctions: Array.from(userFuncMap.values()),
        };
      });
  
      res.Data = {
        ...user,
        Projects: projectWithRoles,
      };
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lý thành công";
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  
  async getPayloadByName(username: string) {
    return this.userRepository.getPayloadByName(username);
  }
}
