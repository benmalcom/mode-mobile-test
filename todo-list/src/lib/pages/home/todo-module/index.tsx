import { SearchIcon } from '@chakra-ui/icons';
import {
  Flex,
  Button,
  Heading,
  Text,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  HStack,
  InputGroup,
  InputLeftElement,
  Input,
  IconButton,
  ButtonGroup,
  Icon,
} from '@chakra-ui/react';
import type React from 'react';
import { FcTodoList } from 'react-icons/fc';

export const TodoModule: React.FC = () => {
  return (
    <Flex w="full" h="full" gap={10}>
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
          <Button variant="custom" rounded="3xl" px="25px">
            Mint NFT
          </Button>
          <Button colorScheme="gray" rounded="3xl" px="25px">
            Burn NFT
          </Button>
        </Flex>
      </Flex>

      <Flex flexDir="column" gap={4} flex={1} pb={8} h="fit-content">
        <Heading color="black" as="h3" size="xl" fontWeight={500}>
          Todo List
        </Heading>
        <Flex
          justify="space-between"
          align="center"
          bg="white"
          boxShadow="md"
          p={3}
          w="full"
        >
          <Button size="sm" colorScheme="purple" rounded="2xl">
            New Task
          </Button>

          <InputGroup w="250px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input type="search" placeholder="Search" rounded="2xl" />
          </InputGroup>
        </Flex>

        <TableContainer bg="white" boxShadow="md">
          <Table size="md">
            <Thead bg="gray.100" py={8}>
              <Tr py={8}>
                <Th>Title</Th>
                <Th>Priority</Th>
                <Th>Due Date</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>inches</Td>
                <Td>millimetres (mm)</Td>
                <Td>millimetres (mm)</Td>
                <Td>millimetres (mm)</Td>
                <Td>25.4</Td>
              </Tr>
              <Tr>
                <Td>feet</Td>
                <Td>centimetres (cm)</Td>
                <Td>centimetres (cm)</Td>
                <Td>centimetres (cm)</Td>
                <Td>30.48</Td>
              </Tr>
              <Tr>
                <Td>yards</Td>
                <Td>metres (m)</Td>
                <Td>metres (m)</Td>
                <Td>metres (m)</Td>
                <Td>0.91444</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </Flex>
  );
};
