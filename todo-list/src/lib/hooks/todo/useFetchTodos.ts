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
  fetchMoreTodos: () => void; // Add the fetchMoreTodos function to return type
}

export const useFetchTodos = (): UseFetchTodosReturn => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosPagination, setTodosPagination] =
    useState<TodoPagination>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async (params: TodoPagination, append = false) => {
    const abortController = new AbortController(); // Create an AbortController to cancel requests if needed

    try {
      setLoading(true); // Set loading state to true
      const { data, ...rest } = await getToDos(params, abortController.signal);

      setTodos((prevTodos) => (append ? [...prevTodos, ...data] : data)); // Append or replace todos
      setTodosPagination(rest); // Update pagination state
    } catch (e) {
      if (!abortController.signal.aborted) {
        setError(e instanceof Error ? e.message : 'Error fetching todos');
      }
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  useEffect(() => {
    fetchTodos(DEFAULT_PAGINATION); // Fetch initial data
  }, []);

  const fetchMoreTodos = () => {
    const nextPage = todosPagination.page + 1;
    if (nextPage <= Math.ceil(todosPagination.total / todosPagination.limit)) {
      fetchTodos({ ...todosPagination, page: nextPage }, true); // Fetch next page and append results
    }
  };

  return {
    todos,
    setTodos, // Expose setTodos so that other hooks can update the state
    todosPagination,
    loading,
    error,
    fetchMoreTodos, // Export fetchMoreTodos for loading more
  };
};
