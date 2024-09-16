/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Flex, Heading, Icon } from '@chakra-ui/react';
import type React from 'react';
import { FcTodoList } from 'react-icons/fc';

export const Logo = () => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Task Manager';
  const logoText = appName.match(/\b(\w)/g)!.join('');

  return (
    <Flex
      borderRadius="50%"
      w="3rem"
      h="3rem"
      border="1px solid gray"
      p={1}
      align="center"
      justify="center"
    >
      <Icon as={FcTodoList} color="purple" fontSize="24px" />
    </Flex>
  );
};

export default Logo;
