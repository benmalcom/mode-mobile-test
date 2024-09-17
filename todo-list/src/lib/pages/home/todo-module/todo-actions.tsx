import { SearchIcon } from '@chakra-ui/icons';
import {
  Flex,
  Button,
  InputGroup,
  InputLeftElement,
  Input,
} from '@chakra-ui/react';
import type React from 'react';

import { ModalManager } from '~/lib/pages/home/todo-module/todo-modal-manager';

const triggerButton = ({ trigger }: { trigger(): void }) => (
  <Button size="sm" colorScheme="purple" rounded="2xl" onClick={trigger}>
    New Task
  </Button>
);

type TodoActionsProps = {};
export const TodoActions: React.FC<TodoActionsProps> = () => {
  return (
    <Flex
      justify="space-between"
      align="center"
      bg="white"
      boxShadow="md"
      p={3}
      w="full"
    >
      <InputGroup w="250px">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input type="search" placeholder="Search" rounded="2xl" />
      </InputGroup>
      <ModalManager onSave={() => {}} triggerFunc={triggerButton} />
    </Flex>
  );
};
