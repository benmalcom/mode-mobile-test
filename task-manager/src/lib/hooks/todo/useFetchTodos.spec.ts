import { renderHook } from '@testing-library/react-hooks';

import { getToDos } from '~/lib/services/todo';

import { useFetchTodos } from './useFetchTodos';

jest.mock('~/lib/services/todo');

describe('useFetchTodos', () => {
  const mockTodos = [
    { id: '1', title: 'Todo 1' },
    { id: '2', title: 'Todo 2' },
  ];

  it('should fetch todos successfully', async () => {
    (getToDos as jest.Mock).mockResolvedValueOnce({
      data: mockTodos,
      page: 1,
      limit: 10,
      total: 2,
    });

    const { result, waitForNextUpdate } = renderHook(() => useFetchTodos());

    await waitForNextUpdate();

    expect(result.current.todos).toEqual(mockTodos);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should handle error during fetch', async () => {
    const errorMsg = 'Error fetching todos';
    (getToDos as jest.Mock).mockRejectedValueOnce(new Error(errorMsg));

    const { result, waitForNextUpdate } = renderHook(() => useFetchTodos());

    await waitForNextUpdate();

    expect(result.current.error).toBe(errorMsg);
    expect(result.current.loading).toBe(false);
  });
});
