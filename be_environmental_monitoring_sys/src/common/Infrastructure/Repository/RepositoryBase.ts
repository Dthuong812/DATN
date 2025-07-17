import {
  Like,
  Repository,
  FindManyOptions,
  Between,
  SelectQueryBuilder,
  FindOptionsSelect,
  EntityMetadata,
} from 'typeorm';
import { IDaoBase } from '../Dao/Interfaces/IDaoBase';
import { IRepsitoryBase } from './Interfaces/IRepositoryBase';
import { DaoBase } from '../Dao/DaoBase';
import { checkInputType, OrderBy, SelectOption } from 'src/common/Util';
import { ConfigSource } from '@nestjs/microservices/external/kafka.interface';
import { FindOptionsOrder } from 'typeorm';
import { IPaginationOptions } from '../Dao/Interfaces/IPaginationOptions';
import { IPaginationResult } from '../Dao/Interfaces/IPaginationResult';
import { Result_Response, ResultResponse } from 'src/common/ResultResponse';


export abstract class RepositoryBase<TEntity, TDto>
  implements IRepsitoryBase<TEntity, TDto> {
  public _daos: DaoBase<any, any>[];
  constructor(
    daos: DaoBase<any, any>[],
    protected readonly baseUrl?: string,
  ) {
    this._daos = daos;
  }
  async count(): Promise<number> {
    return await this._daos[0].count();
  }
  async create(
    entity: TEntity,
  ): Promise<TEntity> {
    const item = await this._daos[0].create(entity);
    return item;
  }

  async delete(condition: object): Promise<number> {
    const item = this._daos[0]._repository.findOne({ where: condition });
    const res = await this._daos[0].delete(condition);
    return res;
  }

  //Hàm chỉ where theo điều kiện OR
  async findAll(params: {
    page?: number;
    pageSize?: number;
    searchString?: string;
    filter?: string[];
    relations?: string[];
    select?: SelectOption<TEntity>;
    OrderBy?: OrderBy<TEntity>;
  }): Promise<any> {
    try {
      const page = typeof params.page === 'string' ? parseInt(params.page) : params.page || 1;
      const pageSize = typeof params.pageSize === 'string' ? parseInt(params.pageSize) : params.pageSize || 10;
      const skip = (page - 1) * pageSize;
      const take = pageSize;
      const relations = params.relations || [];
      const filters = Array.isArray(params.filter) ? params.filter : [params.filter];
      const metadata = this._daos[0]._repository.metadata;
  
      let where: any = [];
  
      // Xử lý tìm kiếm với searchString
      if (params.searchString && filters.length > 0) {
        filters.forEach((field) => {
            let condition: any = {};
            if (field.includes('.')) {
                // Xử lý field thuộc bảng quan hệ
                const [relation, column] = field.split('.');
                if (!relations.includes(relation)) {
                    relations.push(relation); // Thêm vào danh sách relations nếu chưa tồn tại
                }
                if (!where.some(w => w[relation])) {
                    where.push({ [relation]: {} });
                }
                condition[relation] = condition[relation] || {};
                if (checkInputType(column) === 1) {
                    condition[relation][column] = parseInt(params.searchString.trim());
                } else if (checkInputType(column) === 0) {
                    const d = new Date(params.searchString.trim());
                    const startOfDay = new Date(d.setHours(0, 0, 0, 0));
                    const endOfDay = new Date(d.setHours(23, 59, 59, 999));
                    condition[relation][column] = Between(startOfDay, endOfDay);
                } else {
                    condition[relation][column] = Like(`%${params.searchString}%`);
                }
            } else {
                // Xử lý field thuộc entity chính
                if (checkInputType(field) === 1) {
                    condition[field] = parseInt(params.searchString.trim());
                } else if (checkInputType(field) === 0) {
                    const d = new Date(params.searchString.trim());
                    const startOfDay = new Date(d.setHours(0, 0, 0, 0));
                    const endOfDay = new Date(d.setHours(23, 59, 59, 999));
                    condition[field] = Between(startOfDay, endOfDay);
                } else {
                    condition[field] = Like(`%${params.searchString}%`);
                }
            }
            where.push(condition);  // Thêm điều kiện vào mảng 'where'
        });
    }
      const options: FindManyOptions<TEntity> = {
        where,
        skip,
        take,
        relations,
      };
  
      // Xử lý select
      if (params.select) {
        const selectObj: any = {};
        Object.entries(params.select).forEach(([key, value]) => {
          if (value === true) {
            selectObj[key] = true;
          }
        });
  
        // Xử lý các trường select cho relations
        relations.forEach((relation) => {
          if (params.select[relation]) {
            selectObj[relation] = {};
            (params.select[relation] as string[]).forEach((field) => {
              selectObj[relation][field] = true;
            });
  
            // Thêm khóa ngoại cho quan hệ nếu cần
            const relationMetadata = metadata.relations.find(r => r.propertyName === relation);
            if (relationMetadata) {
              const joinColumns = relationMetadata.joinColumns;
              if (joinColumns && joinColumns.length > 0) {
                const foreignKeyColumn = joinColumns[0]?.referencedColumn?.propertyName;
                selectObj[relation][foreignKeyColumn || 'Id'] = true;
              } else {
                selectObj[relation]['Id'] = true;
              }
            }
          }
        });
  
        options.select = selectObj as FindOptionsSelect<TEntity>;
      }
  
      // Xử lý OrderBy
      if (params.OrderBy) {
        const order: FindOptionsOrder<TEntity> = {};
        Object.entries(params.OrderBy).forEach(([relationOrField, fields]) => {
          if (Array.isArray(fields)) {
            if (relations.includes(relationOrField)) {
              order[relationOrField] = {};
              fields.forEach(({ field, direction }) => {
                order[relationOrField][field] = direction;
              });
            } else {
              fields.forEach(({ field, direction }) => {
                order[field] = direction;
              });
            }
          }
        });
        if (Object.keys(order).length > 0) {
          options.order = order;
        }
      }
  
      // Truy vấn dữ liệu
      const items = await this._daos[0]._repository.find(options);
      const total = await this._daos[0]._repository.count({ where });
  
      return {
        data: items,
        total,
        page,
        pageSize,
      };
    } catch (err) {
      console.error('Error in findAll:', err);
      throw new Error('Unable to fetch data');
    }
  }
  


  private getRelationPrimaryColumns(metadata: EntityMetadata, relationName: string): string[] {
    const relation = metadata.findRelationWithPropertyPath(relationName);
    if (!relation) return [];

    return relation.inverseEntityMetadata.primaryColumns.map(column => column.propertyName);
  }
  async getAll(options?: any): Promise<TEntity[]> {
    return await this._daos[0].getAll(options);
  }
  async getById(Id: Number, relations: string[] = []): Promise<TEntity> {
    return await this._daos[0].getById(Id, relations);
  }
  async getAllHavePage(options: IPaginationOptions<TEntity> = {}): Promise<Result_Response<TEntity>> {
    return await this._daos[0].getAllHavePage(options);
  }
  async getByNameLike(
    fieldName: keyof TEntity,
    searchName: string
  ): Promise<TEntity[]> {
    return await this._daos[0].getByNameLike(fieldName, searchName);
  }
  async getByNameEqual(
    fieldName: keyof TEntity,
    searchName: string,
    SelectField?: string[],
  ): Promise<TEntity[]> {
    return await this._daos[0].getByNameEqual(fieldName, searchName, SelectField);
  }

  async update(
    condition: object,
    entity: TEntity,
    SelectField?: string[],
  ): Promise<TEntity> {
    const item = await this._daos[0].update(condition, entity, SelectField);
    return item;
  }
  async createMany(entities: TEntity[]): Promise<TEntity[]> {
    return await this._daos[0].createMany(entities);
  }

  async softDelete(condition: object): Promise<number> {
    const item = await this._daos[0].softDelete(condition);
    return item;
  }
}
