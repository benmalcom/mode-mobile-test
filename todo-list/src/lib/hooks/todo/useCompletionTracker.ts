import { useState } from 'react';

import type { Todo } from '~/lib/types/todo';

export const useCompletionTracker = () => {
  const [isTwoCompleted, setIsTwoCompleted] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const trackCompletion = (todos: Todo[]) => {
    const newCompletedCount = todos.filter((todo) => todo.completed).length;
    setCompletedCount(newCompletedCount);

    // Check if the completed count is even and has increased
    setIsTwoCompleted(
      newCompletedCount % 2 === 0 && newCompletedCount > completedCount
    );
  };

  return { isTwoCompleted, trackCompletion };
};
