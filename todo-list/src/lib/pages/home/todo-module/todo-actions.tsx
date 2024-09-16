import { SearchIcon } from '@chakra-ui/icons';
import {
  Flex,
  Button,
  InputGroup,
  InputLeftElement,
  Input,
} from '@chakra-ui/react';
import type React from 'react';

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
      <Button size="sm" colorScheme="purple" rounded="2xl">
        New Task
      </Button>
    </Flex>
  );
};
