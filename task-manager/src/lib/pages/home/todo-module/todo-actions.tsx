/* eslint-disable react/no-unstable-nested-components */
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

const NewTaskButton: React.FC<{
  loading?: boolean;
  onTrigger: () => void;
}> = ({ loading, onTrigger }) => (
  <Button
    size="sm"
    colorScheme="purple"
    rounded="2xl"
    onClick={onTrigger}
    isLoading={loading}
  >
    New Task
  </Button>
);

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
          bg="gray.50"
          _focus={{ bg: 'white', borderColor: 'purple.500' }}
          onChange={onSearch}
        />
      </InputGroup>
      <ModalManager
        loading={isCreating}
        onSave={onCreate}
        triggerFunc={({ trigger }) => (
          <NewTaskButton loading={isCreating} onTrigger={trigger} />
        )}
      />
    </Flex>
  );
};
