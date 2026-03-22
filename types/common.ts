export type APIResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type Pagination = {
  limit?: number;
  offset?: number;
  total?: number;
};

export type Status = "draft" | "published" | "archived";
