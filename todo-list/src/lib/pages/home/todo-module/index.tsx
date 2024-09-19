import { Flex, Heading, Stack } from '@chakra-ui/react';
import type React from 'react';
import { useEffect, useState } from 'react';

import { Portfolio } from '~/lib/pages/home/todo-module/portfolio';
import { TodoActions } from '~/lib/pages/home/todo-module/todo-actions';
import { TodoTable } from '~/lib/pages/home/todo-module/todo-table';
import {
  getToDos,
  createToDo,
  updateToDo,
  deleteToDo,
} from '~/lib/services/todo';
import type { Todo, TodoPagination } from '~/lib/types/todo';

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  total: 1,
};

export const TodoModule: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosPagination, setTodosPagination] =
    useState<TodoPagination>(DEFAULT_PAGINATION);
  const [inGetTodosFlight, setGetTodosFlight] = useState(true);
  const [getTodosError, setGetTodosError] = useState<string | null>(null);

  // Loading states for CRUD operations
  const [isCreating, setIsCreating] = useState(false);
  const [updating, setUpdating] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<Set<string>>(new Set());

  useEffect(() => {
    const abortController = new AbortController(); // Create an instance of AbortController

    const fetchTodos = async (params: TodoPagination) => {
      try {
        const { data, ...rest } = await getToDos(
          params,
          abortController.signal
        );
        setTodos(data);
        setTodosPagination(rest);
      } catch (e) {
        if (!abortController.signal.aborted) {
          setGetTodosError(
            e instanceof Error ? e.message : 'Error getting todos'
          );
        }
      } finally {
        setGetTodosFlight(false);
      }
    };

    fetchTodos(DEFAULT_PAGINATION);

    return () => {
      abortController.abort(); // Abort fetch on component unmount or effect cleanup
    };
  }, []);

  const handleTodoCreate = async (
    values: Record<string, unknown>,
    callback?: () => void
  ) => {
    setIsCreating(true);
    try {
      const newTodo = await createToDo(values as Omit<Todo, 'id'>);
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      callback?.();
    } catch (e) {
      console.error('Error creating todo:', e);
    } finally {
      setIsCreating(false);
    }
  };

  const handleTodoUpdate = async (
    todoId: string,
    updatedTodo: Todo,
    callback?: () => void
  ) => {
    console.log('todoId ', todoId);
    setUpdating((prev) => new Set(prev).add(todoId));
    try {
      const updated = await updateToDo(todoId, updatedTodo);
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === todoId ? updated : todo))
      );
      callback?.();
    } catch (e) {
      console.error('Error updating todo:', e);
    } finally {
      setUpdating((prev) => {
        const updatedSet = new Set(prev);
        updatedSet.delete(todoId);
        return updatedSet;
      });
    }
  };

  const handleTodoDelete = async (todoId: string) => {
    setDeleting((prev) => new Set(prev).add(todoId));
    try {
      await deleteToDo(todoId);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
    } catch (e) {
      console.error('Error deleting todo:', e);
    } finally {
      setDeleting((prev) => {
        const updatedSet = new Set(prev);
        updatedSet.delete(todoId);
        return updatedSet;
      });
    }
  };

  return (
    <Flex h="full" gap={10} w="1180px" mx="auto" mt={28}>
      <Portfolio />
      <Stack spacing={4} flex={1} h="fit-content">
        <Heading as="h3" size="xl" fontWeight={500} color="purple.900">
          Todo List
        </Heading>
        <TodoActions onCreate={handleTodoCreate} isCreating={isCreating} />
        <TodoTable
          todos={todos}
          loading={inGetTodosFlight}
          onUpdate={handleTodoUpdate}
          onDelete={handleTodoDelete}
          updating={updating}
          deleting={deleting}
          pagination={todosPagination}
        />
      </Stack>
    </Flex>
  );
};
