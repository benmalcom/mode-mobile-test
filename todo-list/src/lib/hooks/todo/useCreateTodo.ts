import { useToast } from '@chakra-ui/react';
import type React from 'react';
import { useState } from 'react';

import { createToDo as createToDoService } from '~/lib/services/todo';
import type { Todo } from '~/lib/types/todo';

interface UseCreateTodoReturn {
  createTodo: (
    values: Record<string, unknown>,
    callback?: () => void
  ) => Promise<void>;
  isCreating: boolean;
  error: string | null;
}

type UseCreateTodoParams = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  updatePaginationOnChange(action: 'create' | 'delete'): void;
};

export const useCreateTodo = ({
  setTodos,
  updatePaginationOnChange,
}: UseCreateTodoParams): UseCreateTodoReturn => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const createTodo = async (
    values: Record<string, unknown>,
    callback?: () => void
  ) => {
    setIsCreating(true);
    try {
      const newTodo = await createToDoService(values as Omit<Todo, 'id'>);
      setTodos((prevTodos) => [...prevTodos, newTodo]); // Add the new todo to the array
      updatePaginationOnChange('create');
      callback?.();
      toast({
        description: 'Todo created successfully.',
        status: 'success',
      });
    } catch (e) {
      const err = e instanceof Error ? e.message : 'Error creating todo';
      setError(err);
      toast({
        description: err,
        status: 'error',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return { createTodo, isCreating, error };
};
