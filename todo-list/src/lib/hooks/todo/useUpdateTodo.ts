import { useToast } from '@chakra-ui/react';
import type React from 'react';
import { useState } from 'react';

import { updateToDo } from '~/lib/services/todo';
import type { Todo } from '~/lib/types/todo';

interface UseUpdateTodoReturn {
  updateTodo: (
    todoId: string,
    updatedTodo: Todo,
    callback?: () => void
  ) => Promise<void>;
  updating: Set<string>;
  error: string | null;
}

export const useUpdateTodo = (
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
): UseUpdateTodoReturn => {
  const [updating, setUpdating] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const updateTodo = async (
    todoId: string,
    updatedTodo: Todo,
    callback?: () => void
  ) => {
    setUpdating((prev) => new Set(prev).add(todoId));
    try {
      const updated = await updateToDo(todoId, updatedTodo);
      setTodos(
        (prevTodos) =>
          prevTodos.map((todo) => (todo.id === todoId ? updated : todo)) // Replace the updated todo
      );
      callback?.();
      toast({
        description: 'Todo updated successfully.',
        status: 'success',
      });
    } catch (e) {
      const err = e instanceof Error ? e.message : 'Error updating todo';
      setError(err);
      toast({
        description: err,
        status: 'error',
      });
    } finally {
      setUpdating((prev) => {
        const updatedSet = new Set(prev);
        updatedSet.delete(todoId);
        return updatedSet;
      });
    }
  };

  return { updateTodo, updating, error };
};
