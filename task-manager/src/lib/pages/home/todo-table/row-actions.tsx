/* eslint-disable react/no-unstable-nested-components */
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  type MenuItemProps,
  MenuList,
} from '@chakra-ui/react';
import type React from 'react';
import { BsThreeDots } from 'react-icons/bs';

import { ModalManager as EditTodoModal } from '~/lib/pages/home/todo-module/add-edit-modal';
import { ModalManager as ViewTodoModal } from '~/lib/pages/home/todo-module/view-modal';
import type { Todo } from '~/lib/types/todo';

const EnhancedMenuItem = (props: MenuItemProps) => (
  <MenuItem {...props} fontSize="sm" />
);

const EditMenuItem: React.FC<{ onTrigger: () => void }> = ({ onTrigger }) => (
  <EnhancedMenuItem onClick={onTrigger}>Edit</EnhancedMenuItem>
);

const ViewMenuItem: React.FC<{ onTrigger: () => void }> = ({ onTrigger }) => (
  <EnhancedMenuItem onClick={onTrigger}>More Info</EnhancedMenuItem>
);

export const RowActions: React.FC<{
  todo: Todo;
  onUpdate: (todoId: string, updatedTodo: Todo, callback?: () => void) => void;
  onDelete: (todoId: string) => void;
}> = ({ todo, onUpdate, onDelete }) => {
  return (
    <Menu placement="left-start">
      <MenuButton
        as={IconButton}
        aria-label="Dropdown options"
        icon={<BsThreeDots color="purple.600" />}
        variant="outline"
        border="1px solid"
        borderColor="gray.200"
        h={4}
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
            onClick={() => onUpdate(todo.id, { ...todo, completed: true })}
          >
            Mark as Completed
          </EnhancedMenuItem>
        )}
        <EditTodoModal
          loading={false} // Add appropriate loading state
          onSave={(values, callback) =>
            onUpdate(
              todo.id,
              { completed: false, ...todo, ...values },
              callback
            )
          }
          initialValues={todo}
          triggerFunc={({ trigger }) => <EditMenuItem onTrigger={trigger} />}
        />
        <ViewTodoModal
          todo={todo}
          triggerFunc={({ trigger }) => <ViewMenuItem onTrigger={trigger} />}
        />
        <EnhancedMenuItem color="red.500" onClick={() => onDelete(todo.id)}>
          Delete
        </EnhancedMenuItem>
      </MenuList>
    </Menu>
  );
};
