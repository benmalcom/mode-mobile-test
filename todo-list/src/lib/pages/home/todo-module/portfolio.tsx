import { Flex, Button, Heading, Text } from '@chakra-ui/react';
import type React from 'react';
import { GiBurningBlobs } from 'react-icons/gi';
import { MdOutlineCreateNewFolder } from 'react-icons/md';

type PortfolioProps = {};
export const Portfolio: React.FC<PortfolioProps> = () => {
  return (
    <Flex
      flexDir="column"
      position="sticky"
      zIndex={5}
      marginTop="80px"
      gap={6}
    >
      <Flex
        flexDir="column"
        align="center"
        justify="center"
        boxSizing="border-box"
        p={4}
        w="250px"
        h="fit-content"
        rounded="md"
        border="3px dashed"
        borderColor="gray.400"
        borderWidth="3px"
        gap={2}
      >
        <Text color="gray.500">Your Portfolio</Text>
        <Heading color="black" as="h4" size="lg">
          $48,000
        </Heading>
      </Flex>

      <Flex w="full" justify="space-between">
        <Button
          variant="custom"
          rounded="3xl"
          leftIcon={<MdOutlineCreateNewFolder />}
          iconSpacing={1}
        >
          Mint NFT
        </Button>
        <Button
          colorScheme="red"
          rounded="3xl"
          leftIcon={<GiBurningBlobs />}
          iconSpacing={1}
          variant="outline"
        >
          Burn NFT
        </Button>
      </Flex>
    </Flex>
  );
};

export default Portfolio;
