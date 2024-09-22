import { SearchIcon } from '@chakra-ui/icons';
import {
  Flex,
  Button,
  InputGroup,
  InputLeftElement,
  Input,
} from '@chakra-ui/react';
import type React from 'react';
import type { ChangeEvent } from 'react';

import { ModalManager } from '~/lib/pages/home/todo-module/add-edit-modal';

type TodoActionsProps = {
  onCreate(values: Record<string, unknown>, callback?: () => void): void;
  isCreating?: boolean;
  onSearch(e: ChangeEvent<HTMLInputElement>): void;
};
export const TodoActions: React.FC<TodoActionsProps> = ({
  onCreate,
  isCreating,
  onSearch,
}) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      bg="white"
      boxShadow="md"
      p={3}
      w="full"
      border="1px solid"
      borderColor="purple.200"
    >
      <InputGroup w="250px">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          type="search"
          placeholder="Search task by title"
          rounded="2xl"
          colorScheme="purple"
          bg="gray.50" // Gray background by default
          _focus={{ bg: 'white', borderColor: 'purple.500' }} // White background when active
          onChange={onSearch}
        />
      </InputGroup>
      <ModalManager
        loading={isCreating}
        onSave={onCreate}
        triggerFunc={({ trigger }) => (
          <Button
            size="sm"
            colorScheme="purple"
            rounded="2xl"
            onClick={() => trigger()}
          >
            New Task
          </Button>
        )}
      />
    </Flex>
  );
};
