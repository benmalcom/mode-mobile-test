type Priority = 'low' | 'medium' | 'high';

export type Todo = {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  completed?: boolean;
};
