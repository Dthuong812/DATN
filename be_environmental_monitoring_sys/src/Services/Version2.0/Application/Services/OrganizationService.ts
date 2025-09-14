import { DepartmentRepository } from './../../Infrastructure/Repository/DepartmentRepository';
import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { OrganizationEntity } from "../../Domain/Models/organization.entity";
import {
  CreateOrganizationDto,
  OrganizationDto,
  UpdateOrganizationDto,
} from "../../Domain/Dto/organization.dto";
import { OrganizationRepository } from "../../Infrastructure/Repository/OrganizationRepository";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { ProjectOrganizationDto } from "../../Domain/Dto/project_organization.dto";
import { ProjectOrganizationRepository } from "../../Infrastructure/Repository/ProjectOrganizationRepository";
import { Mapper } from "../../Domain/Mapper/Mapper";
import { ProjectRepository } from "../../Infrastructure/Repository/ProjectRepository";
import { LocalRepository } from '../../Infrastructure/Repository/LocalRepository';

@Injectable()
export class OrganizationService extends CoreServiceBase<
  OrganizationEntity,
  OrganizationDto
> {
  constructor(
    private readonly OrganizationRepository: OrganizationRepository,
    private readonly ProOrgRepository: ProjectOrganizationRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly DepartmentRepository: DepartmentRepository,
    private readonly LocalRepository: LocalRepository,
  ) {
    super(OrganizationRepository);
  }
  async createOrganization(
    payload: CreateOrganizationDto,
    authId: number
  ): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      if (payload.Project && payload.Project.length > 0) {
        const ids = payload.Project.map((p) => p.Id);
        const duplicateIds = ids.filter((id, idx) => ids.indexOf(id) !== idx);
        if (duplicateIds.length > 0) {
          res.Status = ErrorCode.SAVE_FAIL;
          res.Message = `Project Id bị trùng lặp: ${duplicateIds.join(", ")}`;
          return res;
        }
        for (const item of payload.Project) {
          const project = await this.projectRepository.getById(item.Id);
          if (!project) {
            res.Status = ErrorCode.SAVE_FAIL;
            res.Message = `Dự án không tồn tại`;
            return res;
          }
        }
      }
      payload.CreatedBy = authId;
      const newOrganization = await this.OrganizationRepository.create(
        Mapper.mapDtoToEntity(payload, OrganizationEntity)
      );
      if (payload.Project && payload.Project.length > 0) {
        const ProjectOrganization: ProjectOrganizationDto[] = [];
        for (const item of payload.Project) {
          const proOrg = new ProjectOrganizationDto();
          proOrg.Organization_Id = newOrganization.Id;
          proOrg.Project_Id = item.Id;
          ProjectOrganization.push(proOrg);
        }
        await this.ProOrgRepository.createMany(ProjectOrganization);
      }
      res.Data = newOrganization;
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Tạo thành công";
    } catch (err) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = err.message;
    }
    return res;
  }

  async updateOrganization(
    Id: number,
    payload: UpdateOrganizationDto,
    authId: number
  ): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const org = await this.OrganizationRepository.getById(Id);
      if (!org) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Không tìm thấy tổ chức";
        return res;
      }
      if (payload.Project && payload.Project.length > 0) {
        const ids = payload.Project.map((p) => p.Id);
        const duplicateIds = ids.filter((id, idx) => ids.indexOf(id) !== idx);
        if (duplicateIds.length > 0) {
          res.Status = ErrorCode.SAVE_FAIL;
          res.Message = `Project Id bị trùng lặp: ${duplicateIds.join(", ")}`;
          return res;
        }
        for (const item of payload.Project) {
          const project = await this.projectRepository.getById(item.Id);
          if (!project) {
            res.Status = ErrorCode.SAVE_FAIL;
            res.Message = `Dự án không tồn tại`;
            return res;
          }
        }
      }
      payload.UpdatedBy = authId;
      const newOrg = await this.OrganizationRepository.update(
        { Id },
        Mapper.mapDtoToEntity(payload, OrganizationEntity)
      );
      await this.ProOrgRepository.delete({ Organization_Id: Id });
      if (payload.Project && payload.Project.length > 0) {
        const ProjectOrganization: ProjectOrganizationDto[] = [];
        for (const item of payload.Project) {
          const proOrg = new ProjectOrganizationDto();
          proOrg.Organization_Id = newOrg.Id;
          proOrg.Project_Id = item.Id;
          ProjectOrganization.push(proOrg);
        }
        await this.ProOrgRepository.createMany(ProjectOrganization);
      }
      res.Data = newOrg;
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Cập nhật thành công";
    } catch (err) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = err.message;
    }
    return res;
  }

  async deleteOrganization(Id: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const org = await this.OrganizationRepository.getById(Id);
      if (!org) {
        res.Status = ErrorCode.NOT_FOUND_ID;
        res.Message = "Không tìm thấy tổ chức";
        return res;
      }
      await this.ProOrgRepository.delete({ Organization_Id: Id });
      await this.DepartmentRepository.softDelete({ Organization_Id: Id });
      await this.OrganizationRepository.softDelete({ Parent_Id: Id });
      await this.OrganizationRepository.softDelete({ Id });
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Xóa thành công";
    } catch (err) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = err.message;
    }
    return res;
  }
  async getAll(): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const orgs = await this.OrganizationRepository.getAll();
      const organization = await Promise.all(
        orgs.map(async (org) => {
          const parent = org.Parent_Id
          ? await this.OrganizationRepository.getById(org.Parent_Id)
          : null;
          const local = await this.LocalRepository.getById(org.Local_Id);
          return {
            ...org,
            LocalName: local ? local.Name : null,
            ParentName: parent?.Name ?? null,
          };
        })
      );
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Lấy dữ liệu thành công";
      res.Data =  organization;
    }
    catch (err) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = err.message;
    }
    return res;
  }
  async getById(Id: number): Promise<ResultResponse> {
    const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
    try {
      const org = await this.OrganizationRepository.getById(Id);
      if (!org) {
        res.Status = ErrorCode.NOT_FOUND_ID;  
        res.Message = "Không tìm thấy tổ chức";
        return res;
      }

      const parent = org.Parent_Id
        ? await this.OrganizationRepository.getById(org.Parent_Id)
        : null;
      const local = await this.LocalRepository.getById(org.Local_Id);
      const projects = await this.ProOrgRepository.getAll({
        where:{ Organization_Id: Id }
      });
      const projectList = await Promise.all(
        projects.map(async (pro) => {
          const project = await this.projectRepository.getById(pro.Project_Id);
          return project;
        })
      );
      res.Status = ErrorCode.SUCCESS;
      res.Message = "Lấy dữ liệu thành công";
      res.Data = {
        ...org,
        LocalName: local ? local.Name : null,
        ParentName: parent?.Name ?? null,
        Project: projectList,
      };
    } catch (err) {
      res.Status = ErrorCode.EXCEPTION;
      res.Message = err.message;
    } 
    return res;
  }
}
