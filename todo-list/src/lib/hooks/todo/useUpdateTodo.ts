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
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error updating todo');
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
