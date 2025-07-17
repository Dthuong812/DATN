import { FindOptionsSelect } from "typeorm";

export interface IPaginationOptions<TEntity> {
    where?: any;
    orderBy?: { field: keyof TEntity; direction: 'ASC' | 'DESC' };
    select?: (keyof TEntity)[] | FindOptionsSelect<TEntity>;
    relations?: string[];
    page?: number;
    pageSize?: number;
}