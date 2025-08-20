import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { UserEntity } from "src/Services/Domain/Models/users.entity";
import {
  PayLoadCreateUserDto,
  PayLoadUpdateUserDto,
  UserDto,
} from "src/Services/Domain/Dtos/users.dto";
import { UserRepository } from "src/Services/Infrastructure/Repository/UserRepository";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import * as argon2 from "argon2";
import { Mapper } from "src/Services/Domain/Mapper/Mapper";
import { UserRoleAssignmentsDto } from "src/Services/Domain/Dtos/user_role_assignments.dto";
import { UserRoleAssignmentsRepository } from "src/Services/Infrastructure/Repository/UserRoleAssignmentsRepository";
import { RolesRepository } from "src/Services/Infrastructure/Repository/RoleRepository";
import { RoleFunctionPermissionRepository } from "src/Services/Infrastructure/Repository/RoleFunctionPermissionRepository";
import { FunctionsRepository } from "src/Services/Infrastructure/Repository/FunctionsRepository";
import { PermissionsRepository } from "src/Services/Infrastructure/Repository/PermissionsRepository";

@Injectable()
export class UserService extends CoreServiceBase<UserEntity, UserDto> {
  constructor(private readonly userRepository: UserRepository,
    private readonly userRoleAssignmentsRepository: UserRoleAssignmentsRepository,
    private readonly roleRepository: RolesRepository,
    private readonly RoleFunPerRepository: RoleFunctionPermissionRepository,
    private readonly FunctionsRepository: FunctionsRepository,
    private readonly PermissionsRepository: PermissionsRepository
  ) {
    super(userRepository);
  }
  async getAllUsers(): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const users = await this.userRepository.getAll();
  
      const userWithRoles = await Promise.all(
        users.map(async (user) => {
          const roleMappings = await this.userRoleAssignmentsRepository.getAll({
            where: { UserId: user.Id },
          });
  
          const roles = await Promise.all(
            roleMappings.map(async (r) => {
              const roleEntity = await this.roleRepository.getById(r.RoleId);
              return {
                Id: roleEntity.Id,
                Code: roleEntity.Code,
                Name: roleEntity.Name,
                Description: roleEntity.Description,
              };
            })
          );
  
          return {
            ...user,
            Roles: roles,   
          };
        })
      );
  
      res.Data = userWithRoles;
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lý thành công";
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  
  async createUser(payload: PayLoadCreateUserDto,
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
      if (payload.UserRoles && payload.UserRoles.length > 0) {
        for (const role of payload.UserRoles) {
          console.log(role.Id);
          const existingRole = await this.roleRepository.getById(role.Id);
          console.log(existingRole);
          if (!existingRole) {
            res.Status = ErrorCode.SAVE_FAIL;
            res.Message = `Vai trò không tồn tại`;
            return res;
          }
        }
      }
      if (payload.PassWord) {
        payload.PassWord = await argon2.hash(payload.PassWord);
      }
      payload.CreatedBy = authId;
      payload.CreatedAt = new Date();
      // Tạo người dùng mới
      const newUser = await this.userRepository.create(
        Mapper.mapDtoToEntity(payload, UserEntity)
      );
      // Gán vai trò cho người dùng nếu có
      if (payload.UserRoles && payload.UserRoles.length > 0) {
        const userRoles: UserRoleAssignmentsDto[] = [];
        for (const role of payload.UserRoles) {
          const userRole = new UserRoleAssignmentsDto();
          userRole.UserId = newUser.Id;
          userRole.RoleId = role.Id;  
          userRole.CreatedBy = authId;
          userRole.CreatedAt = new Date();
          userRoles.push(userRole);
        }
      
        await this.userRoleAssignmentsRepository.createMany(userRoles);
      }
      res.Data = newUser;
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Tạo thành công";
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  async updateUser(
    Id: number,
    payload: PayLoadUpdateUserDto,
    authId:number
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
      if (payload.UserRoles && payload.UserRoles.length > 0) {
        for (const role of payload.UserRoles) {
          console.log(role.Id);
          const existingRole = await this.roleRepository.getById(role.Id);
          console.log(existingRole);
          if (!existingRole) {
            res.Status = ErrorCode.SAVE_FAIL;
            res.Message = `Vai trò không tồn tại`;
            return res;
          }
        }
      }

      await this.userRepository.update(
        { Id },
        Mapper.mapDtoToEntity(payload, UserEntity)
      );
      // Xóa các vai trò cũ của người dùng
      await this.userRoleAssignmentsRepository.delete({ UserId: Id });
      // Gán vai trò mới cho người dùng
      if (payload.UserRoles && payload.UserRoles.length > 0) {
        const userRoles: UserRoleAssignmentsDto[] = [];
        for (const role of payload.UserRoles) {
          const userRole = new UserRoleAssignmentsDto();
          userRole.UserId = Id;
          userRole.RoleId = role.Id;  
          userRole.CreatedBy = authId;
          userRole.CreatedAt = new Date();
          userRoles.push(userRole);
        }
      
        await this.userRoleAssignmentsRepository.createMany(userRoles);
      }

      res.Status = ErrorCode.SUCCESS;
      res.Message = "Cập nhật thành công";
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
      await this.userRepository.delete({ Id });
      await this.userRoleAssignmentsRepository.delete({ UserId: Id });
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

      const roleMappings = await this.userRoleAssignmentsRepository.getAll({
        where: { UserId: user.Id },
      });
  
      const roles = await Promise.all(
        roleMappings.map(async (r) => {
          const roleEntity = await this.roleRepository.getById(r.RoleId);
  
          if (!roleEntity) return null;
  
          const roleFuncPerms = await this.RoleFunPerRepository.getAll({
            where: { RoleId: roleEntity.Id },
          });
  

          const functions = await Promise.all(
            roleFuncPerms.map(async (rfp) => {
              const func = await this.FunctionsRepository.getById(rfp.FunctionId);
              const perm = await this.PermissionsRepository.getById(rfp.PermissionId);
  
              return {
                Id: func.Id,
                Code: func.Code,
                Name: func.Name,
                Permissions: [
                  {
                    Id: perm.Id,
                    Code: perm.Code,
                    Name: perm.Name,
                  },
                ],
              };
            })
          );
  
          const funcMap = new Map<number, any>();
          for (const f of functions) {
            if (!funcMap.has(f.Id)) {
              funcMap.set(f.Id, { ...f, Permissions: [...f.Permissions] });
            } else {
              funcMap.get(f.Id).Permissions.push(...f.Permissions);
            }
          }
  
          return {
            Id: roleEntity.Id,
            Code: roleEntity.Code,
            Name: roleEntity.Name,
            Description: roleEntity.Description,
            Functions: Array.from(funcMap.values()),
          };
        })
      );
  
      res.Data = {
        ...user,
        Roles: roles.filter(r => r !== null), 
      };
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xử lý thành công";
    } catch (error) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = error.message;
    }
    return res;
  }
  
}
