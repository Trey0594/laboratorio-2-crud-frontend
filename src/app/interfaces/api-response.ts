export interface Meta {
  method: string;
  url: string;
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  meta?: Meta;
}
