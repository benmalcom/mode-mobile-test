import { useToast } from '@chakra-ui/react';
import { renderHook, act } from '@testing-library/react-hooks';

import { createToDo as createToDoService } from '~/lib/services/todo';

import { useCreateTodo } from './useCreateTodo';

// Mock the required imports
jest.mock('~/lib/services/todo');
jest.mock('@chakra-ui/react', () => ({
  useToast: jest.fn(),
}));

describe('useCreateTodo', () => {
  const mockSetTodos = jest.fn();
  const mockUpdatePagination = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue(mockToast);
    mockSetTodos.mockClear();
    mockUpdatePagination.mockClear();
  });

  it('should create a todo successfully', async () => {
    const newTodo = { id: '1', title: 'New Todo' };
    (createToDoService as jest.Mock).mockResolvedValue(newTodo);

    const { result } = renderHook(() =>
      useCreateTodo({
        setTodos: mockSetTodos,
        updatePaginationOnChange: mockUpdatePagination,
      })
    );

    await act(async () => {
      await result.current.createTodo({ title: 'New Todo' });
    });

    expect(mockSetTodos).toHaveBeenCalledWith(expect.any(Function));
    expect(mockUpdatePagination).toHaveBeenCalledWith('create');
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Todo created successfully.',
        status: 'success',
      })
    );
  });

  it('should handle error when creating todo fails', async () => {
    const errorMsg = 'Error creating todo';
    (createToDoService as jest.Mock).mockRejectedValue(new Error(errorMsg));

    const { result } = renderHook(() =>
      useCreateTodo({
        setTodos: mockSetTodos,
        updatePaginationOnChange: mockUpdatePagination,
      })
    );

    await act(async () => {
      await result.current.createTodo({ title: 'New Todo' });
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
