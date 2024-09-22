import { Button, Flex, Text } from '@chakra-ui/react';
import type React from 'react';

import type { TodoPagination } from '~/lib/types/todo';

export const Pagination: React.FC<{
  pagination: TodoPagination;
  loading: boolean;
  fetchMoreTodos: () => void;
}> = ({ pagination, loading, fetchMoreTodos }) => {
  const handleFetchMore = () => fetchMoreTodos();

  return (
    <Flex justify="space-between" align="center" mt={2}>
      <Text fontSize="sm" color="gray.600">
        Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
        {pagination.total} entries
      </Text>
      <Button
        size="sm"
        isDisabled={
          pagination.page * pagination.limit >= pagination.total || loading
        }
        isLoading={loading}
        loadingText="Fetching more..."
        onClick={handleFetchMore}
      >
        Load older todos
      </Button>
    </Flex>
  );
};
