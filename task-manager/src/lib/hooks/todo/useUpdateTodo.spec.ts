import { useToast } from '@chakra-ui/react';
import { renderHook, act } from '@testing-library/react-hooks';
import type React from 'react'; // Adjust the import path as necessary

import { updateToDo as updateToDoService } from '~/lib/services/todo';
import type { Todo } from '~/lib/types/todo'; // Import the Todo type

import { useUpdateTodo } from './useUpdateTodo';

// Mocking the updateToDoService and useToast
jest.mock('~/lib/services/todo');
jest.mock('@chakra-ui/react', () => ({
  useToast: jest.fn(),
}));

describe('useUpdateTodo', () => {
  let setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  const mockSetTodos = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    // Set up the mocks before each test
    (useToast as jest.Mock).mockReturnValue(mockToast);
    setTodos = mockSetTodos;
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  it('should successfully update a todo', async () => {
    const updatedTodo: Todo = {
      id: '1',
      title: 'Updated Todo',
      description: 'This is an updated todo',
      dueDate: new Date(),
      priority: 'medium',
      completed: false,
    }; // Example of updated todo structure
    (updateToDoService as jest.Mock).mockResolvedValue(updatedTodo); // Mock successful update

    const { result } = renderHook(() => useUpdateTodo(mockSetTodos));

    await act(async () => {
      await result.current.updateTodo('1', updatedTodo); // Call the updateTodo function
    });

    expect(mockSetTodos).toHaveBeenCalledTimes(1); // Ensure setTodos is called
    expect(mockSetTodos).toHaveBeenCalledWith(expect.any(Function)); // Ensure it receives a function to update the state
    expect(mockToast).toHaveBeenCalledWith({
      description: 'Todo updated successfully.',
      status: 'success',
    });
    expect(result.current.error).toBeNull(); // Ensure there is no error
  });

  it('should handle an error when updating a todo', async () => {
    const errorMessage = 'Error updating todo'; // Example error message
    (updateToDoService as jest.Mock).mockRejectedValue(new Error(errorMessage)); // Mock error response

    const { result } = renderHook(() => useUpdateTodo(mockSetTodos));

    await act(async () => {
      await result.current.updateTodo('1', {
        id: '1',
        title: 'Todo',
        description: 'Initial todo description',
        dueDate: new Date(),
        priority: 'medium',
        completed: true,
      }); // Call with test data
    });

    expect(mockSetTodos).not.toHaveBeenCalled(); // No state update should occur
    expect(mockToast).toHaveBeenCalledWith({
      description: errorMessage,
      status: 'error',
    });
    expect(result.current.error).toBe(errorMessage); // Check for error state
  });

  it('should handle multiple concurrent updates', async () => {
    const updatedTodo1: Todo = {
      id: '1',
      title: 'Updated Todo 1',
      description: 'Description 1',
      dueDate: new Date(),
      priority: 'low',
      completed: false,
    };
    const updatedTodo2: Todo = {
      id: '2',
      title: 'Updated Todo 2',
      description: 'Description 2',
      dueDate: new Date(),
      priority: 'high',
      completed: true,
    };

    // Mocking the resolved values for the service
    (updateToDoService as jest.Mock)
      .mockResolvedValueOnce(updatedTodo1)
      .mockResolvedValueOnce(updatedTodo2);

    const { result } = renderHook(() => useUpdateTodo(mockSetTodos));

    await act(async () => {
      await result.current.updateTodo('1', updatedTodo1);
      await result.current.updateTodo('2', updatedTodo2);
    });

    expect(mockSetTodos).toHaveBeenCalledTimes(2); // Expect setTodos to have been called twice
    expect(mockToast).toHaveBeenCalledTimes(2); // Ensure toast is called for each update
    expect(result.current.error).toBeNull(); // Ensure no errors occurred
  });
});
