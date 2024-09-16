import { Flex, Heading, Stack } from '@chakra-ui/react';
import type React from 'react';

import { Portfolio } from '~/lib/pages/home/todo-module/portfolio';
import { TodoActions } from '~/lib/pages/home/todo-module/todo-actions';
import { TodoTable } from '~/lib/pages/home/todo-module/todo-table';

export const TodoModule: React.FC = () => {
  return (
    <Flex w="full" h="full" gap={10}>
      <Portfolio />
      <Stack spacing={4} flex={1} h="fit-content">
        <Heading color="black" as="h3" size="xl" fontWeight={500}>
          Todo List
        </Heading>
        <TodoActions />
        <TodoTable todos={[]} />
      </Stack>
    </Flex>
  );
};
