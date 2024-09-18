import {
  Flex,
  Button,
  Text,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Badge,
} from '@chakra-ui/react';
import type React from 'react';

import type { Todo, TodoPriority } from '~/lib/types/todo';
import { TODO_PRIORITIES } from '~/lib/utils/constants';

const PRIORITY_BADGE_MAP: { [key in TodoPriority]: string } = {
  low: 'blackAlpha',
  medium: 'orange',
  high: 'red',
};

const fetchPriorityLabel = (priority: TodoPriority) =>
  TODO_PRIORITIES.find((item) => item.value === priority)?.label;

type TableProps = {
  todos: Todo[];
  loading?: boolean;
  isUpdating: Set<string>;
  isDeleting: Set<string>;
  onUpdate(todoId: string, updatedTodo: Todo): void;
  onDelete(todoId: string): void;
};
export const TodoTable: React.FC<TableProps> = ({ todos }) => {
  return (
    <TableContainer bg="white" boxShadow="md">
      <Table size="md">
        <Thead bg="gray.100" py={8}>
          <Tr py={8}>
            <Th>Title</Th>
            <Th>Priority</Th>
            <Th>Due Date</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {todos.map((todo) => (
            <Tr key={todo.id}>
              <Td>{todo.title}</Td>
              <Td>
                <Badge colorScheme={PRIORITY_BADGE_MAP[todo.priority]}>
                  {fetchPriorityLabel(todo.priority)}
                </Badge>
              </Td>
              <Td>{new Date(todo.dueDate).toISOString()}</Td>
              <Td>
                {todo.completed ? (
                  <Badge
                    variant="subtle"
                    colorScheme="green"
                    textTransform="capitalize"
                  >
                    Completed
                  </Badge>
                ) : (
                  <Badge variant="subtle" textTransform="capitalize">
                    Not Completed
                  </Badge>
                )}
              </Td>
              <Td>-</Td>
            </Tr>
          ))}
        </Tbody>

        <Tfoot>
          <Tr>
            <Td colSpan={5}>
              <Flex justify="space-between" align="center" mt={4}>
                <Text>Showing 1 to 3 of 10 entries</Text>
                <Flex gap={2}>
                  <Button size="sm" onClick={() => console.log('Previous')}>
                    Previous
                  </Button>
                  <Button size="sm" onClick={() => console.log('Next')}>
                    Next
                  </Button>
                </Flex>
              </Flex>
            </Td>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};

export default TodoTable;
