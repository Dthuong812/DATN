export interface IPaginationResult<TEntity> {
  items: TEntity[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}