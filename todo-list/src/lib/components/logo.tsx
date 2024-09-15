/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Flex, Heading } from '@chakra-ui/react';

export const Logo = () => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Task Manager';
  const logoText = appName.match(/\b(\w)/g)!.join('');

  return (
    <Flex
      borderRadius="50%"
      w="3rem"
      h="3rem"
      border="1px solid purple"
      p={1}
      align="center"
      justify="center"
    >
      <Heading as="h4" size="md" color="purple" userSelect="none">
        {logoText}
      </Heading>
    </Flex>
  );
};

export default Logo;
