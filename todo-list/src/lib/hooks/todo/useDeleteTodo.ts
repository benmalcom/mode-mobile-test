import { useToast } from '@chakra-ui/react';
import type React from 'react';
import { useState } from 'react';

import { deleteToDo } from '~/lib/services/todo';
import type { Todo } from '~/lib/types/todo';

interface UseDeleteTodoReturn {
  deleteTodo: (todoId: string) => Promise<void>;
  deleting: Set<string>;
  error: string | null;
}

export const useDeleteTodo = (
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
): UseDeleteTodoReturn => {
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const deleteTodo = async (todoId: string, callback?: () => void) => {
    setDeleting((prev) => new Set(prev).add(todoId));
    try {
      await deleteToDo(todoId);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId)); // Remove the deleted todo
      callback?.();
      toast({
        description: 'Todo deleted successfully.',
        status: 'success',
      });
    } catch (e) {
      const err = e instanceof Error ? e.message : 'Error deleting todo';
      setError(err);
      toast({
        description: err,
        status: 'error',
      });
    } finally {
      setDeleting((prev) => {
        const updatedSet = new Set(prev);
        updatedSet.delete(todoId);
        return updatedSet;
      });
    }
  };

  return { deleteTodo, deleting, error };
};
