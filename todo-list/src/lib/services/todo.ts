import { createRequest } from '~/lib/services/http';
import type { Todo, TodoRecord } from '~/lib/types/todo';

// Fetch all ToDos
export const getToDos = async (
  params: Record<string, unknown>,
  signal: AbortSignal
): Promise<TodoRecord> => {
  const response = await createRequest<TodoRecord>({
    url: '/todos',
    params,
    signal,
  });
  return response.data; // Extract data from Axios response
};

// Create a new ToDo
export const createToDo = async (payload: Omit<Todo, 'id'>): Promise<Todo> => {
  const response = await createRequest<Todo>({
    method: 'post',
    url: '/todos',
    data: payload,
  });
  return response.data; // Extract data
};

// Update an existing ToDo
export const updateToDo = async (
  id: string,
  payload: Omit<Todo, 'id'>
): Promise<Todo> => {
  const response = await createRequest<Todo>({
    method: 'put',
    url: `/todos/${id}`,
    data: payload,
  });
  return response.data; // Extract data
};

// Get a specific ToDo by ID
export const getToDo = async (id: string): Promise<Todo> => {
  const response = await createRequest<Todo>({ url: `/todos/${id}` });
  return response.data;
};

// Delete a ToDo
export const deleteToDo = async (id: string): Promise<void> => {
  await createRequest<void>({
    method: 'delete',
    url: `/todos/${id}`,
  });
};
