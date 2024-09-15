import { Flex, Box, IconButton, HStack } from '@chakra-ui/react';
import type React from 'react';
import { AiOutlinePoweroff } from 'react-icons/ai';

import { Logo } from '~/lib/components/logo';

type NavBarProps = {};

const NavBar: React.FC<NavBarProps> = () => {
  const handleLogOut = async () => {};

  return (
    <Box
      as="nav"
      bg="purple.50"
      boxShadow="sm"
      w="full"
      position="fixed"
      zIndex={10}
      h="65px"
      display="flex"
      alignItems="center"
      px={10}
      borderBottom="0.5px solid #ccc"
    >
      <Flex justify="space-between" w="1180px" mx="auto">
        <Logo />
        <Flex justify="space-between">
          <HStack spacing="3">
            <IconButton
              title="Logout"
              colorScheme="red"
              onClick={handleLogOut}
              variant="ghost"
              icon={<AiOutlinePoweroff fontSize="1.25rem" />}
              aria-label="Open Menu"
            />
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default NavBar;
