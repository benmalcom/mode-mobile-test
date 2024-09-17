import { Flex, Box, IconButton, HStack } from '@chakra-ui/react';
import type React from 'react';
import { AiOutlinePoweroff } from 'react-icons/ai';

import { Logo } from '~/lib/components/logo';
import { useWeb3Auth } from '~/lib/providers/web3-provider';

type NavBarProps = {};

const NavBar: React.FC<NavBarProps> = () => {
  const { disconnect, isConnected } = useWeb3Auth();
  const handleLogOut = async () => {
    disconnect();
  };

  return (
    <Box
      as="nav"
      bg="gray.100"
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
        {isConnected && (
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
        )}
      </Flex>
    </Box>
  );
};

export default NavBar;
