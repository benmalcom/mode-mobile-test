import { Badge, Flex, Icon, Td, Text, Tr } from '@chakra-ui/react';
import { format, isToday } from 'date-fns';
import type React from 'react';
import { FaCircleCheck } from 'react-icons/fa6';

import { RowActions } from '~/lib/pages/home/todo-table/row-actions';
import type { Todo, TodoPriority } from '~/lib/types/todo';
import { TODO_PRIORITIES } from '~/lib/utils/constants';

const PRIORITY_BADGE_MAP: { [key in TodoPriority]: string } = {
  low: 'blackAlpha',
  medium: 'orange',
  high: 'red',
};

const fetchPriorityLabel = (priority: TodoPriority) =>
  TODO_PRIORITIES.find((item) => item.value === priority)?.label;

export const TodoRow: React.FC<{
  todo: Todo;
  updating: Set<string>;
  deleting: Set<string>;
  onUpdate: (todoId: string, updatedTodo: Todo, callback?: () => void) => void;
  onDelete: (todoId: string) => void;
}> = ({ todo, updating, deleting, onUpdate, onDelete }) => {
  const isPending = deleting.has(todo.id) || updating.has(todo.id);

  return (
    <Tr>
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
        {isToday(new Date(todo.dueDate))
          ? 'Today'
          : format(new Date(todo.dueDate), 'MMM dd, yyyy')}
      </Td>
      <Td>
        {todo.completed ? (
          <Flex align="center" gap={1}>
            <Icon as={FaCircleCheck} color="green.500" />
            <Text color="green" textTransform="capitalize" fontSize="sm">
              Completed
            </Text>
          </Flex>
        ) : (
          <Text textTransform="capitalize" color="blackAlpha" fontSize="sm">
            Not Completed
          </Text>
        )}
      </Td>
      <Td>
        {isPending ? (
          <Text color="red.500">Please wait...</Text>
        ) : (
          <RowActions todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
        )}
      </Td>
    </Tr>
  );
};
