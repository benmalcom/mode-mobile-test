import { Flex, Heading, Stack } from '@chakra-ui/react';
import type { ChangeEvent } from 'react';
import type React from 'react';
import { useState, useMemo } from 'react';

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
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term

  const isTwoCompleted = useMemo(() => {
    const completedCount = todos.filter((todo) => todo.completed).length;
    return completedCount >= 2 && completedCount % 2 === 0;
  }, [todos]);

  // Filter todos based on search term
  const filteredTodos = useMemo(() => {
    if (!searchTerm) return todos;
    return todos.filter((todo) =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [todos, searchTerm]);

  // Handle search input change
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Flex
      h="full"
      gap={10}
      w="full"
      mx="auto"
      mt={28}
      flexDir={{ base: 'column', lg: 'row' }}
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
        />
      </Stack>
    </Flex>
  );
};
