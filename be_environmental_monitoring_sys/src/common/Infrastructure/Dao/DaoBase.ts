import { Repository, FindOptionsWhere, ILike, Like, Equal, DataSource, FindOptionsSelect, FindOptionsOrder } from 'typeorm';
import { IDaoBase } from './Interfaces/IDaoBase';
import { DataContext } from '../Data/DataContext';
import { FindOneOptions } from 'typeorm';
import { IPaginationOptions } from './Interfaces/IPaginationOptions';
import { IPaginationResult } from './Interfaces/IPaginationResult';
import { Result_Response } from 'src/common/ResultResponse';

export abstract class DaoBase<TEntity, TDto> implements IDaoBase<TEntity, TDto> {
  public _repository: Repository<TEntity>;
  constructor(private entity: new () => TEntity,
    private databaseUrl: string,
    private entities: any) {
    this.initializeRepository();
  }
  public async initializeRepository() {
    try {
      console.log(this.databaseUrl)
      const dataSource = await DataContext.getInstance(this.databaseUrl, this.entities);
      this._repository = dataSource.getRepository(this.entity);
    } catch (error) {
      console.error('Failed to initialize repository:', error);
      throw error;
    }
  }
  async create(entity: TEntity): Promise<TEntity> {
    return await this._repository.save(entity);
  }
  async getById(Id: Number, relations: string[] = []): Promise<TEntity> {
    const options: FindOneOptions = { where: { Id } };
    if (relations.length > 0) options.relations = relations;
    return await this._repository.findOne(options);
  }
  async getByNameLike(
    fieldName: keyof TEntity,
    searchName: string,
  ): Promise<TEntity[]> {
    return this._repository.find({
      where: {
        [fieldName]: Like(`%${searchName}%`),
      } as any,
    });
  }
  async getByNameEqual(
    fieldName: keyof TEntity,
    searchName: string,
     SelectField?: string[],
  ): Promise<TEntity[]> {
    return this._repository.find({
      where: {
        [fieldName]: Equal(searchName),
      } as any,
      select: SelectField ? (SelectField as (keyof TEntity)[]) : undefined,
    });
  }
  async getAll(options?: any): Promise<TEntity[]> {
    if (!options) return await this._repository.find();
    else 
    {
    const { orderBy,limit,offset,select, where,relations } = options || {};
    const orderCondition = orderBy ? { [orderBy.field]: orderBy.direction } : {}; 
    const take = limit ? limit : undefined;  
    const skip = offset ? offset : undefined; // 👉 Thêm dòng này
    const SelectFields=select?select:undefined;
    const relationFields = relations ? relations : undefined;

    return await this._repository.find({where:where, select:SelectFields,  order: orderCondition, take: take,skip: skip,relations: relationFields,...options});
    }
  }
    async getAllHavePage(options: IPaginationOptions<TEntity> = {}): Promise<Result_Response<TEntity>> {
    const {
      where = {},
      orderBy,
      select,
      relations,
      page = 1,
      pageSize = 10,
    } = options;

    const orderCondition: FindOptionsOrder<TEntity> = {};
if (orderBy) {
  (orderCondition as Record<keyof TEntity, 'ASC' | 'DESC'>)[orderBy.field] = orderBy.direction;
}
    const take = pageSize > 0 ? pageSize : 10;
    const skip = page > 0 ? (page - 1) * take : 0;
    const SelectFields = select ? select : undefined;

    // Đếm tổng số bản ghi
    const totalItems = await this._repository.count({ where });

    // Lấy danh sách bản ghi
    const [items, total] = await this._repository.findAndCount({
      where,
      select: SelectFields as FindOptionsSelect<TEntity> | undefined, // Ép kiểu để tương thích
      order: orderCondition,
      relations,
      take,
      skip,
    });
    // Tính tổng số trang
    const totalPages = Math.ceil(totalItems / take);
    const res=new Result_Response<TEntity>(1,"",items,totalItems,totalPages, page,pageSize);
    return res;
  }
  async findAll(searchname: string): Promise<TEntity[]> {
    return this._repository.find({
      where: { searchname } as unknown as FindOptionsWhere<TEntity>,
    });
  }
  async count(): Promise<number> {
    return await this._repository.count();
  }
  async update(
    condition: object,
    entity: TEntity,
    SelectField?: string[],
  ): Promise<TEntity> {
    const existingEntity = await this._repository.findOne({
      where:  condition as FindOptionsWhere<TEntity>,
      select: SelectField ? (SelectField as (keyof TEntity)[]) : undefined,
    });
    if (!existingEntity) return null;

    Object.assign(existingEntity, entity);
    const result = await this._repository.save(existingEntity);
    if (result) {
      if (SelectField) {
        const selectedEntity: Partial<TEntity> = {};
        SelectField.forEach((field) => {
          if (Object.prototype.hasOwnProperty.call(existingEntity, field)) {
            selectedEntity[field as keyof TEntity] =
              existingEntity[field as keyof TEntity];
          }
        });
        return selectedEntity as TEntity;
      } else return result;
    } else return null;
  }
  async delete(condition: object): Promise<number> {
    return await this._repository
      .delete(condition)
      .then(() => {
        return 1;
      })
      .catch((err) => {
        return 0;
      });
  }
  async createMany(entities: TEntity[]): Promise<TEntity[]> {
    return await this._repository.save(entities);
  }

  async softDelete(condition: object): Promise<number>{
    return await this._repository.softDelete(condition)
      .then(() => {
        return 1;
      })
      .catch((err) => {
        return 0;
      });
  }
}



