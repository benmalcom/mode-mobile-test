import { Flex, Heading, Stack } from '@chakra-ui/react';
import type React from 'react';
import { useMemo } from 'react';

import { useCreateTodo } from '~/lib/hooks/todo/useCreateTodo';
import { useDeleteTodo } from '~/lib/hooks/todo/useDeleteTodo';
import { useFetchTodos } from '~/lib/hooks/todo/useFetchTodos';
import { useUpdateTodo } from '~/lib/hooks/todo/useUpdateTodo';
import { Portfolio } from '~/lib/pages/home/todo-module/portfolio';
import { TodoActions } from '~/lib/pages/home/todo-module/todo-actions';
import { TodoTable } from '~/lib/pages/home/todo-module/todo-table';

export const TodoModule: React.FC = () => {
  const {
    todos,
    todosPagination,
    loading: isFetching,
    setTodos,
    fetchMoreTodos,
  } = useFetchTodos();
  const { createTodo, isCreating } = useCreateTodo(setTodos);
  const { updateTodo, updating } = useUpdateTodo(setTodos);
  const { deleteTodo, deleting } = useDeleteTodo(setTodos);

  const isTwoCompleted = useMemo(() => {
    const completedCount = todos.filter((todo) => todo.completed).length;
    return completedCount >= 2 && completedCount % 2 === 0;
  }, [todos]);

  return (
    <Flex h="full" gap={10} w="1180px" mx="auto" mt={28}>
      <Portfolio isTwoCompleted={isTwoCompleted} />
      <Stack spacing={4} flex={1} h="fit-content">
        <Heading as="h3" size="xl" fontWeight={500} color="purple.900">
          Todo List
        </Heading>
        <TodoActions onCreate={createTodo} isCreating={isCreating} />
        <TodoTable
          todos={todos}
          loading={isFetching}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          updating={updating}
          deleting={deleting}
          pagination={todosPagination}
          fetchMoreTodos={fetchMoreTodos}
        />
      </Stack>
    </Flex>
  );
};
