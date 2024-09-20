import { useToast } from '@chakra-ui/react';
import type React from 'react';
import { useState } from 'react';

import { createToDo } from '~/lib/services/todo';
import type { Todo } from '~/lib/types/todo';

interface UseCreateTodoReturn {
  createTodo: (
    values: Record<string, unknown>,
    callback?: () => void
  ) => Promise<void>;
  isCreating: boolean;
  error: string | null;
}

export const useCreateTodo = (
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
): UseCreateTodoReturn => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const createTodo = async (
    values: Record<string, unknown>,
    callback?: () => void
  ) => {
    setIsCreating(true);
    try {
      const newTodo = await createToDo(values as Omit<Todo, 'id'>);
      setTodos((prevTodos) => [...prevTodos, newTodo]); // Add the new todo to the array
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
