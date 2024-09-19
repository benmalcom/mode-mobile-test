import type React from 'react';
import { useEffect, useState } from 'react';

import { getToDos } from '~/lib/services/todo';
import type { Todo, TodoPagination } from '~/lib/types/todo';

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  total: 1,
};

// Define the return type for useFetchTodos
interface UseFetchTodosReturn {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todosPagination: TodoPagination;
  loading: boolean;
  error: string | null;
}

export const useFetchTodos = (): UseFetchTodosReturn => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosPagination, setTodosPagination] =
    useState<TodoPagination>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController(); // Create an AbortController to cancel requests if needed

    const fetchTodos = async (params: TodoPagination) => {
      try {
        setLoading(true); // Set loading state to true
        const { data, ...rest } = await getToDos(
          params,
          abortController.signal
        );
        setTodos(data); // Update todos state
        setTodosPagination(rest); // Update pagination state
      } catch (e) {
        if (!abortController.signal.aborted) {
          setError(e instanceof Error ? e.message : 'Error fetching todos');
        }
      } finally {
        setLoading(false); // Set loading state to false
      }
    };

    fetchTodos(DEFAULT_PAGINATION); // Fetch initial data

    return () => {
      abortController.abort(); // Abort the fetch request on component unmount
    };
  }, []);

  return {
    todos,
    setTodos, // Expose setTodos so that other hooks can update the state
    todosPagination,
    loading,
    error,
  };
};
