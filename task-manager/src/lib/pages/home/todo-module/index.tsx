import { Flex, Heading, Stack } from '@chakra-ui/react';
import { useState, useMemo, useCallback } from 'react';
import type React from 'react';
import type { ChangeEvent } from 'react';

import { useCreateTodo } from '~/lib/hooks/todo/useCreateTodo';
import { useDeleteTodo } from '~/lib/hooks/todo/useDeleteTodo';
import { useFetchTodos } from '~/lib/hooks/todo/useFetchTodos';
import { useUpdateTodo } from '~/lib/hooks/todo/useUpdateTodo';
import { Portfolio } from '~/lib/pages/home/todo-module/portfolio';
import { TodoActions } from '~/lib/pages/home/todo-module/todo-actions';
import { TodoTable } from '~/lib/pages/home/todo-table';

export const TodoModule: React.FC = () => {
  const {
    todos,
    todosPagination,
    loading: isFetching,
    setTodos,
    fetchMoreTodos,
    updatePaginationOnChange,
  } = useFetchTodos();

  const { createTodo, isCreating } = useCreateTodo({
    setTodos,
    updatePaginationOnChange,
  });
  const { updateTodo, updating } = useUpdateTodo(setTodos);
  const { deleteTodo, deleting } = useDeleteTodo({
    setTodos,
    updatePaginationOnChange,
  });

  const [searchTerm, setSearchTerm] = useState<string>('');

  // Memoize the logic to check if there are two completed tasks
  const isTwoCompleted = useMemo(() => {
    const completedCount = todos.filter((todo) => todo.completed).length;
    return completedCount >= 2 && completedCount % 2 === 0;
  }, [todos]);

  // Memoize filtered todos based on search term
  const filteredTodos = useMemo(() => {
    if (!searchTerm) return todos;
    return todos.filter((todo) =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [todos, searchTerm]);

  // Memoized search handler to avoid re-renders on child components
  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!todos.length) return;
      setSearchTerm(e.target.value);
    },
    [todos.length]
  );

  const hasSearchCriteria = useMemo(
    () => searchTerm.length > 0,
    [searchTerm.length]
  );

  return (
    <Flex
      h="full"
      gap={10}
      w="full"
      mx="auto"
      mt={28}
      flexDir={{ base: 'column', lg: 'row' }}
      id="todoModule"
    >
      <Portfolio isTwoCompleted={isTwoCompleted} />
      <Stack
        spacing={4}
        flex={1}
        h="fit-content"
        w={{ base: '95%', lg: 'unset' }}
        mx={{ base: 'auto', lg: 'unset' }}
      >
        <Heading as="h3" size="xl" fontWeight={500} color="purple.900">
          Task Manager
        </Heading>
        <TodoActions
          onCreate={createTodo}
          isCreating={isCreating}
          onSearch={handleSearch}
        />
        <TodoTable
          todos={filteredTodos}
          loading={isFetching}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          updating={updating}
          deleting={deleting}
          pagination={todosPagination}
          fetchMoreTodos={fetchMoreTodos}
          hasSearchCriteria={hasSearchCriteria}
        />
      </Stack>
    </Flex>
  );
};
