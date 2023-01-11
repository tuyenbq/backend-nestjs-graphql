export interface PagerInformation {
  pageTotal?: number;
  pageSize?: number;
  currentPage?: number;
  totalCount?: number;
}

export interface DataAndPagination<T> {
  items: T[];
  pagination: PagerInformation;
}
