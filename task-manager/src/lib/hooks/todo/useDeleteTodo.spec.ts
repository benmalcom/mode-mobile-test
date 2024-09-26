import { useToast } from '@chakra-ui/react';
import { renderHook, act } from '@testing-library/react-hooks';

import { deleteToDo as deleteToDoService } from '~/lib/services/todo';

import { useDeleteTodo } from './useDeleteTodo';

jest.mock('~/lib/services/todo');
jest.mock('@chakra-ui/react', () => ({
  useToast: jest.fn(),
}));

describe('useDeleteTodo', () => {
  const mockSetTodos = jest.fn();
  const mockUpdatePagination = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue(mockToast);
    mockSetTodos.mockClear();
    mockUpdatePagination.mockClear();
  });

  it('should delete a todo successfully', async () => {
    (deleteToDoService as jest.Mock).mockResolvedValueOnce({});

    const { result } = renderHook(() =>
      useDeleteTodo({
        setTodos: mockSetTodos,
        updatePaginationOnChange: mockUpdatePagination,
      })
    );

    await act(async () => {
      await result.current.deleteTodo('1');
    });

    expect(mockSetTodos).toHaveBeenCalledWith(expect.any(Function));
    expect(mockUpdatePagination).toHaveBeenCalledWith('delete');
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Todo deleted successfully.',
        status: 'success',
      })
    );
    expect(result.current.deleting).not.toContain('1');
  });

  it('should handle error when deleting todo fails', async () => {
    const errorMsg = 'Error deleting todo';
    (deleteToDoService as jest.Mock).mockRejectedValueOnce(new Error(errorMsg));

    const { result } = renderHook(() =>
      useDeleteTodo({
        setTodos: mockSetTodos,
        updatePaginationOnChange: mockUpdatePagination,
      })
    );

    await act(async () => {
      await result.current.deleteTodo('1');
    });

    expect(result.current.error).toBe(errorMsg);
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        description: errorMsg,
        status: 'error',
      })
    );
  });
});
