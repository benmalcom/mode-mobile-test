/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Flex, Icon } from '@chakra-ui/react';
import type { FC } from 'react';
import { FcTodoList } from 'react-icons/fc';

export const Logo: FC = () => (
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

export default Logo;
