import { RoleFunctionPermissionDao } from './../../Infrastructure/Dao/RoleFunctionPermissionDao';
import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { RolesEntity } from "src/Services/Domain/Models/roles.entity";
import { PayloadCreateRoleDto, PayloadUpdateRoleDto, RolesDto } from "src/Services/Domain/Dtos/roles.dto";
import { RolesRepository } from "src/Services/Infrastructure/Repository/RoleRepository";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { Mapper } from "src/Services/Domain/Mapper/Mapper";
import { RoleFunctionPermissionEntity } from "src/Services/Domain/Models/role_function_permission.entity";
import { RoleFunctionPermissionRepository } from 'src/Services/Infrastructure/Repository/RoleFunctionPermissionRepository';
import { Not } from 'typeorm';

@Injectable()
export class RolesService extends CoreServiceBase<RolesEntity, RolesDto> {
  constructor(private readonly RolesRepository: RolesRepository,
    private readonly RoleFunctionPermissionRepository:RoleFunctionPermissionRepository
  ) {
    super(RolesRepository);
  }
  async createRole(payload:PayloadCreateRoleDto):Promise<ResultResponse>{
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try{
        const roleData = await this.RolesRepository.getAll({
            where:{
                Code: payload.Code
            }
        })
        if(roleData && roleData.length > 0){
            res.Status = ErrorCode.SAVE_FAIL
            res.Message = "Vai trò đã tồn tại";
            return res;
        }
        payload.CreatedAt = new Date();
        const newRole = await this.RolesRepository.create(Mapper.mapDtoToEntity(payload, RolesEntity));

        if(payload.Functions && payload.Functions.length > 0){
          const RoleFunctionPermission : RoleFunctionPermissionEntity[] = []
          for(const func of payload.Functions){
            if(func.Permissions?.length>0){
                for(const perm of func.Permissions){
                    const roleFuncPerm = new RoleFunctionPermissionEntity();
                    roleFuncPerm.RoleId = newRole.Id;
                    roleFuncPerm.FunctionId = func.Id;
                    roleFuncPerm.PermissionId = perm.Id;
                    RoleFunctionPermission.push(roleFuncPerm);
                }
            }
        }
        await this.RoleFunctionPermissionRepository.createMany(RoleFunctionPermission);
    }
        res.Status = ErrorCode.SUCCESS;
        res.Message = "Tạo thành công";
        res.Data = newRole;
    }
    catch(error){
        res.Status = ErrorCode.EXCEPTION;
        res.Message = error.message;
    }
    return res;
  }
  //update
  async updateRole(Id: number, payload: PayloadUpdateRoleDto): Promise<ResultResponse> {
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
     
      await this.RolesRepository.update({ Id },Mapper.mapDtoToEntity(payload,  RolesEntity));

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
        await this.RoleFunctionPermissionRepository.createMany(RoleFunctionPermission);
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
}
