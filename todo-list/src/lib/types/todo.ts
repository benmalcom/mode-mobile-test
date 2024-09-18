export type TodoPriority = 'low' | 'medium' | 'high';

export type Todo = {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: TodoPriority;
  completed?: boolean;
};

export type TodoRecord = {
  data: Todo[];
  page: number;
  limit: number;
  total: number;
};
