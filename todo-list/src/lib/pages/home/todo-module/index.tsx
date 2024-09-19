import { Flex, Heading, Stack } from '@chakra-ui/react';
import type React from 'react';
import { useEffect } from 'react';

import { useCompletionTracker } from '~/lib/hooks/todo/useCompletionTracker';
import { useCreateTodo } from '~/lib/hooks/todo/useCreateTodo';
import { useDeleteTodo } from '~/lib/hooks/todo/useDeleteTodo';
import { useFetchTodos } from '~/lib/hooks/todo/useFetchTodos';
import { useUpdateTodo } from '~/lib/hooks/todo/useUpdateTodo';
import { Portfolio } from '~/lib/pages/home/todo-module/portfolio';
import { TodoActions } from '~/lib/pages/home/todo-module/todo-actions';
import { TodoTable } from '~/lib/pages/home/todo-module/todo-table';

export const TodoModule: React.FC = () => {
  const { isTwoCompleted, trackCompletion } = useCompletionTracker();
  const {
    todos,
    todosPagination,
    loading: isFetching,
    error: fetchError,
    setTodos,
  } = useFetchTodos();
  const {
    createTodo,
    isCreating,
    error: createError,
  } = useCreateTodo(setTodos);
  const { updateTodo, updating, error: updateError } = useUpdateTodo(setTodos);
  const { deleteTodo, deleting, error: deleteError } = useDeleteTodo(setTodos);

  useEffect(() => {
    trackCompletion(todos);
  }, [todos, trackCompletion]);

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
        />
      </Stack>
    </Flex>
  );
};
