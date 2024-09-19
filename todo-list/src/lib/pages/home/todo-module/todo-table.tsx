import type { MenuItemProps } from '@chakra-ui/react';
import {
  Icon,
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
  IconButton,
  MenuList,
  Menu,
  MenuButton,
  MenuItem,
  Skeleton,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import type React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { FaCircleCheck } from 'react-icons/fa6';

import { ModalManager } from '~/lib/pages/home/todo-module/todo-modal-manager';
import type { Todo, TodoPagination, TodoPriority } from '~/lib/types/todo';
import { TODO_PRIORITIES } from '~/lib/utils/constants';

const PRIORITY_BADGE_MAP: { [key in TodoPriority]: string } = {
  low: 'blackAlpha',
  medium: 'orange',
  high: 'red',
};

const fetchPriorityLabel = (priority: TodoPriority) =>
  TODO_PRIORITIES.find((item) => item.value === priority)?.label;

const EnhancedMenuItem = (props: MenuItemProps) => (
  <MenuItem {...props} fontSize="sm" />
);

type SkeletonLoaderProps = {
  rows?: number;
  columnsPerRow?: number;
};
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  rows = 5,
  columnsPerRow = 5,
}) => (
  <>
    {Array(rows)
      .fill(null)
      .map((_, rowIndex) => (
        <Tr key={Number(rowIndex).toString()}>
          {Array(columnsPerRow)
            .fill(null)
            .map((__, colIndex) => (
              <Td key={Number(colIndex).toString()}>
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
  loading?: boolean;
  updating: Set<string>;
  deleting: Set<string>;
  onUpdate(todoId: string, updatedTodo: Todo, callback?: () => void): void;
  onDelete(todoId: string): void;
};
export const TodoTable: React.FC<TableProps> = ({
  todos,
  pagination,
  updating,
  onUpdate,
  onDelete,
  deleting,
  loading,
}) => {
  return (
    <TableContainer bg="white" boxShadow="md">
      <Table size="md" variant="simple">
        <Thead bg="gray.100">
          <Tr py={2}>
            <Th>Title</Th>
            <Th>Priority</Th>
            <Th>Due Date</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {todos.map((todo) => {
            return (
              <Tr key={todo.id}>
                <Td>{todo.title}</Td>
                <Td>
                  <Badge
                    colorScheme={PRIORITY_BADGE_MAP[todo.priority]}
                    textTransform="capitalize"
                    rounded="lg"
                    px={2}
                    fontWeight={500}
                  >
                    {fetchPriorityLabel(todo.priority)}
                  </Badge>
                </Td>
                <Td fontSize="sm">
                  {format(new Date(todo.dueDate), 'MMM dd, yyyy')}
                </Td>
                <Td>
                  {todo.completed ? (
                    <Flex align="center" gap={1}>
                      <Icon as={FaCircleCheck} color="green.500" />
                      <Text
                        color="green"
                        textTransform="capitalize"
                        rounded="md"
                        fontSize="sm"
                      >
                        Completed
                      </Text>
                    </Flex>
                  ) : (
                    <Text
                      textTransform="capitalize"
                      color="blackAlpha"
                      fontSize="sm"
                    >
                      Not Completed
                    </Text>
                  )}
                </Td>
                <Td>
                  {deleting.has(todo.id) || updating.has(todo.id) ? (
                    <Text color="red.500">Please wait...</Text>
                  ) : (
                    <Menu placement="left-start">
                      <MenuButton
                        h="20px"
                        as={IconButton}
                        aria-label="Dropdown options"
                        icon={<BsThreeDots color="purple.600" />}
                        variant="outline"
                        border="1px solid"
                        borderColor="gray.200"
                      />

                      <MenuList
                        width={{ base: '150px' }}
                        minWidth="130px"
                        boxShadow="lg"
                        border="1px solid"
                        borderColor="purple.200"
                      >
                        {!todo.completed && (
                          <EnhancedMenuItem
                            onClick={() =>
                              onUpdate(todo.id, { ...todo, completed: true })
                            }
                          >
                            Mark as Completed
                          </EnhancedMenuItem>
                        )}

                        <ModalManager
                          loading={updating.has(todo.id)}
                          onSave={(values, callback) =>
                            onUpdate(
                              todo.id,
                              { completed: false, ...values } as Todo,
                              callback
                            )
                          }
                          initialValues={todo}
                          triggerFunc={({ trigger }) => (
                            <EnhancedMenuItem onClick={() => trigger()}>
                              Edit
                            </EnhancedMenuItem>
                          )}
                        />

                        <EnhancedMenuItem onClick={() => onDelete(todo.id)}>
                          More Info
                        </EnhancedMenuItem>
                        <EnhancedMenuItem
                          color="red.500"
                          onClick={() => onDelete(todo.id)}
                        >
                          Delete
                        </EnhancedMenuItem>
                      </MenuList>
                    </Menu>
                  )}
                </Td>
              </Tr>
            );
          })}
          {loading && <SkeletonLoader />}
        </Tbody>

        <Tfoot>
          <Tr>
            <Td colSpan={5}>
              <Flex justify="space-between" align="center" mt={4}>
                <Text fontSize="sm" color="gray.600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{' '}
                  of {pagination.total} entries
                </Text>
                <Flex gap={2}>
                  <Button
                    size="sm"
                    isDisabled={pagination.page <= 1}
                    onClick={() => console.log('Previous')}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => console.log('Next')}
                    isDisabled={
                      pagination.total <= pagination.limit * pagination.page
                    }
                  >
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
