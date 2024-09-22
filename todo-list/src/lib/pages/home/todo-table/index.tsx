import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Skeleton,
  TableCaption,
  Highlight,
} from '@chakra-ui/react';
import type React from 'react';

import { Pagination } from '~/lib/pages/home/todo-table/pagination';
import { TodoRow } from '~/lib/pages/home/todo-table/todo-row';
import type { Todo, TodoPagination } from '~/lib/types/todo';

type SkeletonLoaderProps = {
  rows?: number;
  columnsPerRow?: number;
};

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  rows = 5,
  columnsPerRow = 5,
}) => (
  <>
    {Array.from({ length: rows }, (_, rowIndex) => (
      <Tr key={rowIndex}>
        {Array.from({ length: columnsPerRow }, (__, colIndex) => (
          <Td key={colIndex}>
            <Skeleton height="20px" />
          </Td>
        ))}
      </Tr>
    ))}
  </>
);

type TableProps = {
  todos: Todo[];
  pagination: TodoPagination;
  loading: boolean;
  updating: Set<string>;
  deleting: Set<string>;
  onUpdate(todoId: string, updatedTodo: Todo, callback?: () => void): void;
  onDelete(todoId: string): void;
  fetchMoreTodos: () => void;
};

export const TodoTable: React.FC<TableProps> = ({
  todos,
  pagination,
  updating,
  onUpdate,
  onDelete,
  deleting,
  loading,
  fetchMoreTodos,
}) => {
  return (
    <TableContainer bg="white" boxShadow="md" overflow="auto" maxHeight="700px">
      <Table size="md" variant="simple">
        {!loading && todos.length === 0 && (
          <TableCaption>
            <Highlight query="New Task" styles={{ color: 'purple.500' }}>
              You currently don&apos;t have any task, use the New Task button to
              create one.
            </Highlight>
          </TableCaption>
        )}

        <Thead bg="gray.100">
          <Tr>
            <Th>Title</Th>
            <Th>Priority</Th>
            <Th>Due Date</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {todos.map((todo) => (
            <TodoRow
              key={todo.id}
              todo={todo}
              updating={updating}
              deleting={deleting}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
          {loading && <SkeletonLoader />}
        </Tbody>

        {pagination.total > 0 && (
          <Tfoot>
            <Tr>
              <Td colSpan={5}>
                <Pagination
                  pagination={pagination}
                  loading={loading}
                  fetchMoreTodos={fetchMoreTodos}
                />
              </Td>
            </Tr>
          </Tfoot>
        )}
      </Table>
    </TableContainer>
  );
};

export default TodoTable;
