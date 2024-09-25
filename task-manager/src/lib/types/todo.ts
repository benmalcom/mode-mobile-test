export type TodoPriority = 'low' | 'medium' | 'high';

export type Todo = {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: TodoPriority;
  completed?: boolean;
};
// Base pagination type to avoid repetition
export type Pagination = {
  page: number;
  limit: number;
  total: number;
};

// Extend the base pagination type to include todo data
export type TodoRecord = Pagination & {
  data: Todo[];
};

// Use the base pagination type directly for TodoPagination
export type TodoPagination = Pagination;
