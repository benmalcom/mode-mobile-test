import {
  Flex,
  Button,
  Text,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
} from '@chakra-ui/react';
import type React from 'react';

import type { Todo } from '~/lib/types/todo';

type TableProps = {
  todos: Todo[];
  loading?: boolean;
};
export const TodoTable: React.FC<TableProps> = () => {
  return (
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

        <Tfoot>
          <Tr>
            <Td colSpan={5}>
              <Flex justify="space-between" align="center" mt={4}>
                <Text>Showing 1 to 3 of 10 entries</Text>
                <Flex gap={2}>
                  <Button size="sm" onClick={() => console.log('Previous')}>
                    Previous
                  </Button>
                  <Button size="sm" onClick={() => console.log('Next')}>
                    Next
                  </Button>
                </Flex>
              </Flex>
            </Td>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};

export default TodoTable;
