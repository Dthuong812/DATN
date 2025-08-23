import { PermissionsRepository } from "./../../Infrastructure/Repository/PermissionsRepository";
import { FunctionsRepository } from "./../../Infrastructure/Repository/FunctionsRepository";
import { UserRepository } from "./../../Infrastructure/Repository/UserRepository";
import { RoleFunctionPermissionDao } from "./../../Infrastructure/Dao/RoleFunctionPermissionDao";
import { Injectable } from "@nestjs/common";
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

@Injectable()
export class RolesService extends CoreServiceBase<RolesEntity, RolesDto> {
  constructor(
    private readonly RolesRepository: RolesRepository,
    private readonly userRoleRepository: UserRoleAssignmentsRepository,
    private readonly RoleFunctionPermissionRepository: RoleFunctionPermissionRepository,
    private readonly RoleFunPerRepository: RoleFunctionPermissionRepository,
    private readonly UserRepository: UserRepository,
    private readonly FunctionsRepository: FunctionsRepository,
    private readonly PermissionsRepository: PermissionsRepository
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

      if (payload.Functions && payload.Functions.length > 0) {
        const RoleFunctionPermission: RoleFunctionPermissionEntity[] = [];
        for (const func of payload.Functions) {
          if (func.Permissions?.length > 0) {
            for (const perm of func.Permissions) {
              const roleFuncPerm = new RoleFunctionPermissionEntity();
              roleFuncPerm.RoleId = newRole.Id;
              roleFuncPerm.FunctionId = func.Id;
              roleFuncPerm.PermissionId = perm.Id;
              RoleFunctionPermission.push(roleFuncPerm);
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

      // Update permissions
      if (payload.Functions && payload.Functions.length > 0) {
        await this.RoleFunctionPermissionRepository.delete({ RoleId: Id });
        const RoleFunctionPermission: RoleFunctionPermissionEntity[] = [];
        for (const func of payload.Functions) {
          if (func.Permissions?.length > 0) {
            for (const perm of func.Permissions) {
              const roleFuncPerm = new RoleFunctionPermissionEntity();
              roleFuncPerm.RoleId = Id;
              roleFuncPerm.FunctionId = func.Id;
              roleFuncPerm.PermissionId = perm.Id;
              RoleFunctionPermission.push(roleFuncPerm);
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
      await this.RolesRepository.delete({ Id });
      await this.RoleFunctionPermissionRepository.delete({ RoleId: Id });
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xóa thành công";
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
      const roleFuncPerms = await this.RoleFunPerRepository.getAll();
      const totalFunctions = new Set(roleFuncPerms.map((rfp) => rfp.FunctionId))
        .size;
      const totalPermissions = roleFuncPerms.length;
      const result = roleUser.map((r) => ({
        ...r,
        TotalFunctions: totalFunctions,
        TotalPermissions: totalPermissions,
      }));
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lí thành công";
      res.Data = result;
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
      const roleFuncPerms = await this.RoleFunPerRepository.getAll({
        where: { RoleId: role.Id },
      });

      const functionsMap = new Map<number, any>();

      for (const rfp of roleFuncPerms) {
        const func = await this.FunctionsRepository.getById(rfp.FunctionId);
        const perm = await this.PermissionsRepository.getById(rfp.PermissionId);

        if (!functionsMap.has(func.Id)) {
          functionsMap.set(func.Id, {
            Id: func.Id,
            Name: func.Name,
            Code: func.Code,
            Permissions: [],
          });
        }

        functionsMap.get(func.Id).Permissions.push({
          Id: perm.Id,
          Code: perm.Code,
          Name: perm.Name,
        });
      }
      const result = {
        ...role,
        TotalUser: users.length,
        TotalFunctions: functionsMap.size,
        TotalPermissions: roleFuncPerms.length,
        Users: user,
        Functions: Array.from(functionsMap.values()),
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
